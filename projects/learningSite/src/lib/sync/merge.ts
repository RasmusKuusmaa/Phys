import { createEmptyNotebook, type Notebook } from "@/lib/notes/schema";
import { createEmptyProgress, type ConceptStatus, type Progress } from "@/lib/progress/schema";
import { createEmptyJournal, type Journal } from "@/lib/journal/schema";

/**
 * Merging, not overwriting.
 *
 * Two devices can both have edits the other has never seen, so neither
 * side's copy is authoritative. Taking the newer *whole blob* would throw
 * away everything done on the other device since it last synced; these
 * merges work per record instead, so both devices' work survives.
 */

/** Later ISO timestamp wins. Non-parsing values sort as older than anything real. */
function isNewer(a: string | undefined, b: string | undefined): boolean {
  const ta = a ? Date.parse(a) : NaN;
  const tb = b ? Date.parse(b) : NaN;
  if (Number.isNaN(ta)) return false;
  if (Number.isNaN(tb)) return true;
  return ta > tb;
}

/** Keeps whichever tombstone map entry is later, for every id in either. */
function mergeTombstones(
  a: Record<string, string>,
  b: Record<string, string>,
): Record<string, string> {
  const merged: Record<string, string> = { ...a };
  for (const [id, when] of Object.entries(b)) {
    if (!(id in merged) || isNewer(when, merged[id])) merged[id] = when;
  }
  return merged;
}

export function mergeNotebooks(local: Notebook, remote: Notebook): Notebook {
  const deletedNotes = mergeTombstones(local.deletedNotes, remote.deletedNotes);
  const deletedHighlights = mergeTombstones(local.deletedHighlights, remote.deletedHighlights);

  const notes: Notebook["notes"] = {};
  for (const id of new Set([...Object.keys(local.notes), ...Object.keys(remote.notes)])) {
    const mine = local.notes[id];
    const theirs = remote.notes[id];
    const winner = !mine ? theirs : !theirs ? mine : isNewer(theirs.updatedAt, mine.updatedAt) ? theirs : mine;
    if (!winner) continue;

    // A deletion only wins if it happened after the surviving edit —
    // editing a note on one device after deleting it on another should
    // bring it back, which is what the person's most recent action asked
    // for.
    const deletedAt = deletedNotes[id];
    if (deletedAt && !isNewer(winner.updatedAt, deletedAt)) continue;
    notes[id] = winner;
  }

  const highlights: Notebook["highlights"] = {};
  for (const id of new Set([
    ...Object.keys(local.highlights),
    ...Object.keys(remote.highlights),
  ])) {
    if (id in deletedHighlights) continue;
    const winner = local.highlights[id] ?? remote.highlights[id];
    // Highlights are immutable once made — they have no updatedAt to
    // compare, so either copy will do. What matters is that a highlight
    // whose note is gone doesn't linger.
    if (winner && winner.noteId in notes) highlights[id] = winner;
  }

  return {
    ...createEmptyNotebook(),
    notes,
    highlights,
    deletedNotes,
    deletedHighlights,
  };
}

/** Study progress only ever moves forward, so "further along" is the merge rule. */
const STATUS_RANK: Record<ConceptStatus, number> = { unseen: 0, learning: 1, confident: 2 };

export function mergeProgress(local: Progress, remote: Progress): Progress {
  const conceptStatus: Progress["conceptStatus"] = { ...local.conceptStatus };
  for (const [conceptId, status] of Object.entries(remote.conceptStatus)) {
    const mine = conceptStatus[conceptId];
    if (!mine || STATUS_RANK[status] > STATUS_RANK[mine]) conceptStatus[conceptId] = status;
  }

  // Max, not sum. These are cumulative running totals, so adding two
  // devices' counts would double-count every session they both saw; max
  // keeps the fuller history without inventing mistakes nobody made.
  const misconceptionHits: Progress["misconceptionHits"] = { ...local.misconceptionHits };
  for (const [id, count] of Object.entries(remote.misconceptionHits)) {
    misconceptionHits[id] = Math.max(misconceptionHits[id] ?? 0, count);
  }

  return { ...createEmptyProgress(), conceptStatus, misconceptionHits };
}

/** Sessions merge by `updatedAt`-wins with tombstones, same shape as `mergeNotebooks`'s notes; days merge by `updatedAt`-wins with no tombstone, since a reflection is only ever upserted, never deleted. */
export function mergeJournal(local: Journal, remote: Journal): Journal {
  const deletedSessions = mergeTombstones(local.deletedSessions, remote.deletedSessions);

  const sessions: Journal["sessions"] = {};
  for (const id of new Set([...Object.keys(local.sessions), ...Object.keys(remote.sessions)])) {
    const mine = local.sessions[id];
    const theirs = remote.sessions[id];
    const winner = !mine ? theirs : !theirs ? mine : isNewer(theirs.updatedAt, mine.updatedAt) ? theirs : mine;
    if (!winner) continue;

    // Same "a later edit outruns an earlier deletion" rule as notes.
    const deletedAt = deletedSessions[id];
    if (deletedAt && !isNewer(winner.updatedAt, deletedAt)) continue;
    sessions[id] = winner;
  }

  const days: Journal["days"] = {};
  for (const date of new Set([...Object.keys(local.days), ...Object.keys(remote.days)])) {
    const mine = local.days[date];
    const theirs = remote.days[date];
    const winner = !mine ? theirs : !theirs ? mine : isNewer(theirs.updatedAt, mine.updatedAt) ? theirs : mine;
    if (winner) days[date] = winner;
  }

  return { ...createEmptyJournal(), sessions, days, deletedSessions };
}
