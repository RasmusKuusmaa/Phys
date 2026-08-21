import { ProgressSchema, createEmptyProgress, type ConceptStatus, type Progress } from "./schema";

export const STORAGE_KEY = "progress";

export function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    const parsed = ProgressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function writeProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  // The native "storage" event only fires in *other* tabs, so this tab's
  // useSyncExternalStore subscribers (see useProgress) need a manual nudge —
  // same trick as ThemeToggle.
  window.dispatchEvent(new Event("storage"));
}

export function getConceptStatus(progress: Progress, conceptId: string): ConceptStatus {
  return progress.conceptStatus[conceptId] ?? "unseen";
}

export function setConceptStatus(conceptId: string, status: ConceptStatus): void {
  const progress = readProgress();
  writeProgress({
    ...progress,
    conceptStatus: { ...progress.conceptStatus, [conceptId]: status },
  });
}
