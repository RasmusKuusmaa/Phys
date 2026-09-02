"use client";

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useNotes } from "@/lib/notes/useNotes";
import {
  addHighlight,
  createNote,
  deleteNote,
  highlightsForContainer,
  listNotes,
  removeHighlight,
  updateNote,
} from "@/lib/notes/store";
import { createAnchor, dropOverlaps, resolveAnchor } from "@/lib/notes/anchor";
import {
  clearHighlights,
  MARK_NOTE_ATTR,
  offsetsForRange,
  paintHighlights,
} from "@/lib/notes/domRange";
import type { NoteTarget, TextAnchor } from "@/lib/notes/schema";
import { NoteDrawer } from "./NoteDrawer";
import { NoteForm, type NoteDraft } from "./NoteForm";

/**
 * The MDX explanation is server-rendered and handed down as `children`.
 * Memoising on that (stable) element reference keeps React from ever
 * reconciling the subtree, which matters because the highlight painter
 * mutates those exact DOM nodes — React and the painter must not both
 * think they own them.
 */
const StaticProse = memo(function StaticProse({ children }: { children: ReactNode }) {
  return <>{children}</>;
});

type DrawerState =
  | { mode: "new"; anchor: TextAnchor }
  | { mode: "edit"; noteId: string }
  | null;

type PendingSelection = { anchor: TextAnchor; top: number; left: number };

export function HighlightableProse({
  conceptId,
  conceptTitle,
  locale,
  containerKey = "explanation",
  strings,
  typeLabels,
  targets,
  children,
}: {
  conceptId: string;
  /** Used as the default title for a note made from a selection here. */
  conceptTitle: string;
  locale: Locale;
  containerKey?: string;
  strings: Messages["notes"];
  typeLabels: Record<NoteTarget["kind"], string>;
  targets: NoteTarget[];
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const notebook = useNotes();
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [pending, setPending] = useState<PendingSelection | null>(null);

  // Repaint whenever the stored highlights change. Anchors are resolved
  // against the *live* text, so prose that has been re-authored since a
  // highlight was made simply yields no range and stays unpainted rather
  // than marking the wrong words.
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !notebook) return;

    clearHighlights(root);
    const text = root.textContent ?? "";
    const spans = highlightsForContainer(notebook, conceptId, locale, containerKey)
      .map((highlight) => {
        const range = resolveAnchor(text, highlight.anchor);
        return range ? { id: highlight.id, noteId: highlight.noteId, ...range } : null;
      })
      .filter((span): span is { id: string; noteId: string; start: number; end: number } => span !== null);

    paintHighlights(root, dropOverlaps(spans));

    // Hand the DOM back exactly as React rendered it, so React never tries
    // to remove a text node the painter has since replaced.
    return () => clearHighlights(root);
  }, [notebook, conceptId, locale, containerKey]);

  const readSelection = useCallback(() => {
    const root = containerRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.isCollapsed || selection.rangeCount === 0) {
      setPending(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const offsets = offsetsForRange(root, range);
    if (!offsets) {
      setPending(null);
      return;
    }

    const anchor = createAnchor(root.textContent ?? "", offsets.start, offsets.end);
    if (!anchor) {
      setPending(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    setPending({ anchor, top: rect.top, left: rect.left + rect.width / 2 });
  }, []);

  function openNoteFor(target: EventTarget | null) {
    if (!(target instanceof Element)) return false;
    const mark = target.closest(`mark[${MARK_NOTE_ATTR}]`);
    const noteId = mark?.getAttribute(MARK_NOTE_ATTR);
    if (!noteId) return false;
    setDrawer({ mode: "edit", noteId });
    return true;
  }

  function saveNewNote(draft: NoteDraft, anchor: TextAnchor) {
    const note = createNote({
      title: draft.title || conceptTitle,
      body: draft.body,
      links: draft.links,
    });
    addHighlight({ noteId: note.id, conceptId, locale, containerKey, anchor });
    setDrawer(null);
    setPending(null);
    window.getSelection()?.removeAllRanges();
  }

  // Every note linked to this concept, not just the ones anchored in this
  // locale's prose — a note made on the English page is still a note about
  // this concept when you're reading the Estonian one.
  const pageNotes = notebook
    ? listNotes(notebook).filter((note) =>
        note.links.some((link) => link.kind === "concept" && link.id === conceptId),
      )
    : [];

  const editing = drawer?.mode === "edit" ? (notebook?.notes[drawer.noteId] ?? null) : null;

  // A note deleted in another tab leaves the drawer pointing at nothing.
  // Derived rather than corrected back into state: writing the fix into
  // `drawer` would mean a render whose only job is to undo a render.
  const openDrawer: DrawerState =
    drawer?.mode === "edit" && notebook !== null && editing === null ? null : drawer;

  return (
    <>
      <p className="mt-10 text-xs text-muted">{strings.selectionHint}</p>

      <div
        ref={containerRef}
        // Names the anchor space these offsets are relative to — the same
        // key stored on every highlight made here.
        data-highlight-container={containerKey}
        onMouseUp={readSelection}
        onKeyUp={(event) => {
          // Shift+arrow selection from the keyboard, and Enter/Space to open
          // a focused highlight.
          if (event.key === "Enter" || event.key === " ") {
            if (openNoteFor(event.target)) event.preventDefault();
            return;
          }
          readSelection();
        }}
        onClick={(event) => {
          if (openNoteFor(event.target)) event.preventDefault();
        }}
        className="mt-2 space-y-4 text-sm leading-relaxed"
      >
        <StaticProse>{children}</StaticProse>
      </div>

      {pageNotes.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold">{strings.onThisPage}</h2>
            <Link href={`/${locale}/notes`} className="text-xs text-muted underline hover:text-foreground">
              {strings.viewAll}
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {pageNotes.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => setDrawer({ mode: "edit", noteId: note.id })}
                  className="block w-full text-left"
                >
                  <span className="text-sm font-medium underline">
                    {note.title || strings.titlePlaceholder}
                  </span>
                  {note.body && (
                    <span className="mt-0.5 block truncate text-xs text-muted">{note.body}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pending && openDrawer === null && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()} // keep the selection alive through the click
          onClick={() => setDrawer({ mode: "new", anchor: pending.anchor })}
          style={{ top: pending.top, left: pending.left }}
          className="fixed z-40 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-full bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover shadow-lg"
        >
          {strings.addFromSelection}
        </button>
      )}

      {openDrawer?.mode === "new" && (
        <NoteDrawer
          title={strings.newNote}
          closeLabel={strings.close}
          onClose={() => setDrawer(null)}
        >
          <Quote text={openDrawer.anchor.exact} />
          <div className="mt-4">
            <NoteForm
              note={null}
              initialLinks={[{ kind: "concept", id: conceptId }]}
              targets={targets}
              strings={strings}
              typeLabels={typeLabels}
              autoFocus
              onSave={(draft) => saveNewNote(draft, openDrawer.anchor)}
              onCancel={() => setDrawer(null)}
            />
          </div>
        </NoteDrawer>
      )}

      {openDrawer?.mode === "edit" && editing && (
        <NoteDrawer
          title={editing.title || strings.heading}
          closeLabel={strings.close}
          onClose={() => setDrawer(null)}
        >
          <NoteForm
            note={editing}
            targets={targets}
            strings={strings}
            typeLabels={typeLabels}
            autoFocus
            onSave={(draft) => {
              updateNote(editing.id, draft);
              setDrawer(null);
            }}
            onCancel={() => setDrawer(null)}
          />

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            {notebook &&
              highlightsForContainer(notebook, conceptId, locale, containerKey)
                .filter((highlight) => highlight.noteId === editing.id)
                .map((highlight) => (
                  <div key={highlight.id} className="flex items-start justify-between gap-3">
                    <Quote text={highlight.anchor.exact} />
                    <button
                      type="button"
                      onClick={() => removeHighlight(highlight.id)}
                      className="shrink-0 text-xs text-muted underline hover:text-foreground"
                    >
                      {strings.removeHighlight}
                    </button>
                  </div>
                ))}
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(strings.confirmDelete)) return;
                deleteNote(editing.id);
                setDrawer(null);
              }}
              className="text-xs text-muted underline hover:text-foreground"
            >
              {strings.delete}
            </button>
          </div>
        </NoteDrawer>
      )}
    </>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="border-l-2 border-accent pl-3 text-sm text-muted italic">
      {text}
    </blockquote>
  );
}
