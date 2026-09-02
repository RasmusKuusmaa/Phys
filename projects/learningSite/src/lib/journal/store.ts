import { createEmptyJournal, type Journal } from "./schema";
import { migrateJournal } from "./migrations";

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
