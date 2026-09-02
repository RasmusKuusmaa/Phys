"use client";

import { readNotebook, writeNotebook } from "@/lib/notes/store";
import { readProgress, writeProgress } from "@/lib/progress/store";
import { NotebookSchema } from "@/lib/notes/schema";
import { ProgressSchema } from "@/lib/progress/schema";

export type SyncState = "idle" | "syncing" | "synced" | "failed";

/**
 * Pushes this browser's copy and adopts whatever the server merges back.
 *
 * The server does the merging (see /api/sync/[kind]) so two devices syncing
 * at the same moment can't overwrite each other. localStorage stays the
 * source of truth for rendering, which is what keeps the site fully usable
 * signed out and offline — an account adds durability, it doesn't become a
 * requirement.
 */
async function syncKind(
  kind: "notes" | "progress",
  local: unknown,
  adopt: (merged: unknown) => void,
): Promise<void> {
  const response = await fetch(`/api/sync/${kind}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(local),
  });
  if (!response.ok) throw new Error(`sync ${kind} failed: ${response.status}`);

  const { data } = (await response.json()) as { data: unknown };
  const schema = kind === "notes" ? NotebookSchema : ProgressSchema;
  const parsed = schema.safeParse(data);
  // Ignore anything the server hands back that this client can't validate,
  // rather than writing a malformed blob over good local data.
  if (parsed.success) adopt(parsed.data);
}

export async function syncAll(): Promise<void> {
  await Promise.all([
    syncKind("notes", readNotebook(), (merged) => writeNotebook(merged as never)),
    syncKind("progress", readProgress(), (merged) => writeProgress(merged as never)),
  ]);
}

const LAST_SYNC_KEY = "lastSyncedAt";

export function recordSyncTime(): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch {
    // Private-mode or blocked storage — the sync itself still happened.
  }
}

export function lastSyncedAt(): string | null {
  try {
    return localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
}
