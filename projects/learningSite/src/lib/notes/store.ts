import type { Locale } from "@/i18n/locales";
import {
  createEmptyNotebook,
  type Highlight,
  type Note,
  type NoteLink,
  type Notebook,
  type TextAnchor,
} from "./schema";
import { migrateNotebook } from "./migrations";

export const STORAGE_KEY = "notes";

export function readNotebook(): Notebook {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyNotebook();
    return migrateNotebook(JSON.parse(raw));
  } catch {
    return createEmptyNotebook();
  }
}

export function writeNotebook(notebook: Notebook): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notebook));
  // The native "storage" event only fires in *other* tabs, so this tab's
  // useSyncExternalStore subscribers need a manual nudge — same trick as
  // the progress store and ThemeToggle.
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

export function createNote(fields: {
  title?: string;
  body?: string;
  links?: NoteLink[];
}): Note {
  const now = new Date().toISOString();
  const note: Note = {
    id: newId(),
    title: fields.title ?? "",
    body: fields.body ?? "",
    links: fields.links ?? [],
    createdAt: now,
    updatedAt: now,
  };
  const notebook = readNotebook();
  writeNotebook({ ...notebook, notes: { ...notebook.notes, [note.id]: note } });
  return note;
}

export function updateNote(
  noteId: string,
  changes: Partial<Pick<Note, "title" | "body" | "links">>,
): void {
  const notebook = readNotebook();
  const existing = notebook.notes[noteId];
  if (!existing) return;
  const updated: Note = { ...existing, ...changes, updatedAt: new Date().toISOString() };
  writeNotebook({ ...notebook, notes: { ...notebook.notes, [noteId]: updated } });
}

/**
 * Removes the note *and* its highlights — a highlight with no note behind
 * it has nothing to open. Both are tombstoned so a sync from another
 * device can't resurrect them (see NotebookV2Schema).
 */
export function deleteNote(noteId: string): void {
  const notebook = readNotebook();
  const now = new Date().toISOString();

  const notes = { ...notebook.notes };
  delete notes[noteId];

  const removedHighlightIds = Object.values(notebook.highlights)
    .filter((h) => h.noteId === noteId)
    .map((h) => h.id);
  const highlights = { ...notebook.highlights };
  for (const id of removedHighlightIds) delete highlights[id];

  writeNotebook({
    ...notebook,
    notes,
    highlights,
    deletedNotes: { ...notebook.deletedNotes, [noteId]: now },
    deletedHighlights: {
      ...notebook.deletedHighlights,
      ...Object.fromEntries(removedHighlightIds.map((id) => [id, now])),
    },
  });
}

export function addHighlight(fields: {
  noteId: string;
  conceptId: string;
  locale: Locale;
  containerKey: string;
  anchor: TextAnchor;
}): Highlight {
  const highlight: Highlight = {
    id: newId(),
    ...fields,
    createdAt: new Date().toISOString(),
  };
  const notebook = readNotebook();
  writeNotebook({
    ...notebook,
    highlights: { ...notebook.highlights, [highlight.id]: highlight },
  });
  return highlight;
}

export function removeHighlight(highlightId: string): void {
  const notebook = readNotebook();
  const highlights = { ...notebook.highlights };
  delete highlights[highlightId];
  writeNotebook({
    ...notebook,
    highlights,
    deletedHighlights: {
      ...notebook.deletedHighlights,
      [highlightId]: new Date().toISOString(),
    },
  });
}

/** Newest first — the note someone just wrote is the one they want to see. */
export function listNotes(notebook: Notebook): Note[] {
  return Object.values(notebook.notes).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Highlights belonging to one anchor space. Locale is part of the filter
 * because EN and ET prose are different texts — an anchor made in one
 * cannot resolve in the other (see HighlightSchema).
 */
export function highlightsForContainer(
  notebook: Notebook,
  conceptId: string,
  locale: Locale,
  containerKey: string,
): Highlight[] {
  return Object.values(notebook.highlights).filter(
    (h) => h.conceptId === conceptId && h.locale === locale && h.containerKey === containerKey,
  );
}

export function highlightsForNote(notebook: Notebook, noteId: string): Highlight[] {
  return Object.values(notebook.highlights).filter((h) => h.noteId === noteId);
}
