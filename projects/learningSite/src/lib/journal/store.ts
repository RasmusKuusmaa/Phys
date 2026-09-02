import { createEmptyJournal, type Journal, type JournalDay, type StudySession, type Understanding } from "./schema";
import { migrateJournal } from "./migrations";
import { setConceptStatus } from "@/lib/progress/store";

export const STORAGE_KEY = "journal";

export function readJournal(): Journal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyJournal();
    return migrateJournal(JSON.parse(raw));
  } catch {
    return createEmptyJournal();
  }
}

export function writeJournal(journal: Journal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
  // The native "storage" event only fires in *other* tabs, so this tab's
  // useSyncExternalStore subscribers need a manual nudge — same trick as
  // the notes and progress stores.
  window.dispatchEvent(new Event("storage"));
}

/** `crypto.randomUUID` needs a secure context; the counter keeps ids unique if it's unavailable. */
let idCounter = 0;
function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter}`;
}

/**
 * A session's rating is the single input `ConceptStatus` derives from —
 * confident on strong self-assessed understanding, learning on any
 * engagement short of that. This keeps one field ("how well do I know
 * this") rather than a second number drifting alongside the existing one.
 */
function deriveConceptStatus(understanding: Understanding): "learning" | "confident" {
  return understanding >= 4 ? "confident" : "learning";
}

export function logSession(fields: {
  conceptId: string;
  date: string;
  minutes: number;
  understanding: Understanding;
  note?: string;
}): StudySession {
  const now = new Date().toISOString();
  const session: StudySession = {
    id: newId(),
    conceptId: fields.conceptId,
    date: fields.date,
    minutes: fields.minutes,
    understanding: fields.understanding,
    note: fields.note ?? "",
    createdAt: now,
    updatedAt: now,
  };
  const journal = readJournal();
  writeJournal({ ...journal, sessions: { ...journal.sessions, [session.id]: session } });
  setConceptStatus(session.conceptId, deriveConceptStatus(session.understanding));
  return session;
}

export function updateSession(
  sessionId: string,
  changes: Partial<Pick<StudySession, "minutes" | "understanding" | "note">>,
): void {
  const journal = readJournal();
  const existing = journal.sessions[sessionId];
  if (!existing) return;
  const updated: StudySession = { ...existing, ...changes, updatedAt: new Date().toISOString() };
  writeJournal({ ...journal, sessions: { ...journal.sessions, [sessionId]: updated } });
  if (changes.understanding !== undefined) {
    setConceptStatus(updated.conceptId, deriveConceptStatus(updated.understanding));
  }
}

/** Tombstoned, not removed outright, so a sync from another device can't resurrect it — same reasoning as `deleteNote`. */
export function deleteSession(sessionId: string): void {
  const journal = readJournal();
  const sessions = { ...journal.sessions };
  delete sessions[sessionId];
  writeJournal({
    ...journal,
    sessions,
    deletedSessions: { ...journal.deletedSessions, [sessionId]: new Date().toISOString() },
  });
}

/** Upserts the one reflection a date can have. */
export function setReflection(date: string, reflection: string): void {
  const journal = readJournal();
  const day: JournalDay = { date, reflection, updatedAt: new Date().toISOString() };
  writeJournal({ ...journal, days: { ...journal.days, [date]: day } });
}

/** Newest day first, each with its sessions newest first — the day and session someone just logged is the one they want to see. */
export function listSessionsByDate(journal: Journal): [string, StudySession[]][] {
  const byDate = new Map<string, StudySession[]>();
  for (const session of Object.values(journal.sessions)) {
    const list = byDate.get(session.date) ?? [];
    list.push(session);
    byDate.set(session.date, list);
  }
  for (const list of byDate.values()) list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return [...byDate.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function sessionsForConcept(journal: Journal, conceptId: string): StudySession[] {
  return Object.values(journal.sessions).filter((s) => s.conceptId === conceptId);
}
