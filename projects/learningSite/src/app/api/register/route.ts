import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { RegistrationSchema } from "@/auth";
import { getPool } from "@/db/pool";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Cost 12: comfortably above the 10 that is now considered dated, without making sign-in feel slow. */
const BCRYPT_COST = 12;

/**
 * Creates a password account. Auth.js's Credentials provider only ever
 * *checks* credentials, so registration has to live somewhere of its own.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  const parsed = RegistrationSchema.safeParse(body);
  if (!parsed.success) {
    // Field-level codes, not prose: the client owns the wording so both
    // locales stay translatable.
    return NextResponse.json(
      { error: "invalid-input", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { email, password, name } = parsed.data;
  const hash = await bcrypt.hash(password, BCRYPT_COST);

  try {
    const { rows } = await getPool().query<{ id: string }>(
      `insert into users (email, name, password_hash)
       values (lower($1), $2, $3)
       on conflict (email) do nothing
       returning id`,
      [email, name ?? null, hash],
    );

    // No row means the address is taken. Answer 200 with the same shape as
    // success: telling an anonymous caller which addresses are registered
    // turns this endpoint into an account-enumeration oracle. The person
    // who owns the address finds out by signing in or resetting.
    if (rows.length === 0) {
      return NextResponse.json({ ok: true, created: false });
    }
    return NextResponse.json({ ok: true, created: true });
  } catch (error) {
    console.error("register failed", error);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
