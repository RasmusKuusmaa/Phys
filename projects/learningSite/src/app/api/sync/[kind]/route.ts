import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPool } from "@/db/pool";
import { NotebookSchema } from "@/lib/notes/schema";
import { ProgressSchema } from "@/lib/progress/schema";
import { JournalSchema } from "@/lib/journal/schema";
import { TestHistorySchema } from "@/lib/testHistory/schema";
import { mergeNotebooks, mergeProgress, mergeJournal, mergeTestHistory } from "@/lib/sync/merge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = ["notes", "progress", "journal", "testHistory"] as const;
type Kind = (typeof KINDS)[number];

function isKind(value: string): value is Kind {
  return (KINDS as readonly string[]).includes(value);
}

/** Validate on the way in *and* out: the column is jsonb, so nothing but this guarantees the shape. */
function schemaFor(kind: Kind) {
  switch (kind) {
    case "notes":
      return NotebookSchema;
    case "progress":
      return ProgressSchema;
    case "journal":
      return JournalSchema;
    case "testHistory":
      return TestHistorySchema;
  }
}

/** One merge function per kind (see DECISIONS.md § Accounts on why there's no default) — `stored`/`incoming` are both already schema-validated for `kind`, so the cast per branch is just telling TypeScript what the switch already guarantees. */
function merge(kind: Kind, incoming: unknown, stored: unknown): unknown {
  switch (kind) {
    case "notes":
      return mergeNotebooks(
        incoming as Parameters<typeof mergeNotebooks>[0],
        stored as Parameters<typeof mergeNotebooks>[1],
      );
    case "progress":
      return mergeProgress(
        incoming as Parameters<typeof mergeProgress>[0],
        stored as Parameters<typeof mergeProgress>[1],
      );
    case "journal":
      return mergeJournal(incoming as Parameters<typeof mergeJournal>[0], stored as Parameters<typeof mergeJournal>[1]);
    case "testHistory":
      return mergeTestHistory(
        incoming as Parameters<typeof mergeTestHistory>[0],
        stored as Parameters<typeof mergeTestHistory>[1],
      );
  }
}

async function readStored(userId: string, kind: Kind) {
  const { rows } = await getPool().query<{ data: unknown }>(
    `select data from user_data where user_id = $1 and kind = $2`,
    [userId, kind],
  );
  if (rows.length === 0) return null;
  const parsed = schemaFor(kind).safeParse(rows[0]!.data);
  // A blob written by a newer client than this server understands is
  // discarded rather than served back malformed; the client's own
  // migration chain is what upgrades old shapes.
  return parsed.success ? parsed.data : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { kind } = await params;
  if (!isKind(kind)) return NextResponse.json({ error: "unknown-kind" }, { status: 404 });

  return NextResponse.json({ data: await readStored(session.user.id, kind) });
}

/**
 * Push the browser's copy and get the merged result back.
 *
 * The merge happens here, inside one statement's read-modify-write, so two
 * devices syncing at once can't overwrite each other: whoever writes second
 * merges against what the first one just stored.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { kind } = await params;
  if (!isKind(kind)) return NextResponse.json({ error: "unknown-kind" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  const incoming = schemaFor(kind).safeParse(body);
  if (!incoming.success) return NextResponse.json({ error: "invalid-payload" }, { status: 400 });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");
    // Lock this user's row for the transaction so a concurrent sync from
    // another device waits rather than racing.
    const { rows } = await client.query<{ data: unknown }>(
      `select data from user_data where user_id = $1 and kind = $2 for update`,
      [session.user.id, kind],
    );

    const storedParsed = rows.length ? schemaFor(kind).safeParse(rows[0]!.data) : null;
    const stored = storedParsed?.success ? storedParsed.data : null;

    const merged = stored === null ? incoming.data : merge(kind, incoming.data, stored);

    await client.query(
      `insert into user_data (user_id, kind, data, updated_at)
       values ($1, $2, $3, now())
       on conflict (user_id, kind) do update set data = excluded.data, updated_at = now()`,
      [session.user.id, kind, JSON.stringify(merged)],
    );
    await client.query("commit");

    return NextResponse.json({ data: merged });
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error(`sync ${kind} failed`, error);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  } finally {
    client.release();
  }
}
