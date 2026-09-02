import { createEmptyTestHistory, type TestAttempt, type TestHistory } from "./schema";
import { migrateTestHistory } from "./migrations";

export const STORAGE_KEY = "testHistory";

export function readTestHistory(): TestHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyTestHistory();
    return migrateTestHistory(JSON.parse(raw));
  } catch {
    return createEmptyTestHistory();
  }
}

export function writeTestHistory(history: TestHistory): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  // The native "storage" event only fires in *other* tabs, so this tab's
  // useSyncExternalStore subscribers need a manual nudge — same trick as
  // the journal, notes and progress stores.
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

export function recordAttempt(fields: {
  conceptIds: string[];
  percent: number;
  itemCount: number;
}): TestAttempt {
  const attempt: TestAttempt = {
    id: newId(),
    conceptIds: fields.conceptIds,
    percent: fields.percent,
    itemCount: fields.itemCount,
    takenAt: new Date().toISOString(),
  };
  const history = readTestHistory();
  writeTestHistory({ ...history, attempts: { ...history.attempts, [attempt.id]: attempt } });
  return attempt;
}

/** Newest first — the attempt someone just took is the one they want to see. */
export function attemptsForConcept(history: TestHistory, conceptId: string): TestAttempt[] {
  return Object.values(history.attempts)
    .filter((a) => a.conceptIds.includes(conceptId))
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
}
