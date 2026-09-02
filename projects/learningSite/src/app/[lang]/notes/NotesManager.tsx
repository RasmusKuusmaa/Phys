"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useNotes } from "@/lib/notes/useNotes";
import {
  createNote,
  deleteNote,
  highlightsForNote,
  listNotes,
  removeHighlight,
  updateNote,
} from "@/lib/notes/store";
import { noteLinkKey, type Note, type NoteTarget } from "@/lib/notes/schema";
import { searchScore } from "@/lib/search/fuzzyMatch";
import { NoteForm } from "@/components/notes/NoteForm";

/**
 * Two-pane notes browser: the list on the left, the note itself on the
 * right. On narrow screens the panes stack, list first.
 */
export function NotesManager({
  locale,
  strings,
  typeLabels,
  targets,
}: {
  locale: Locale;
  strings: Messages["notes"];
  typeLabels: Record<NoteTarget["kind"], string>;
  targets: NoteTarget[];
}) {
  const notebook = useNotes();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState(false);

  const targetByKey = useMemo(
    () => new Map(targets.map((target) => [noteLinkKey(target), target])),
    [targets],
  );

  const filtered = useMemo(() => {
    if (!notebook) return [];
    const all = listNotes(notebook);
    if (query.trim() === "") return all;
    return all
      .map((note) => ({
        note,
        score: searchScore(query, note.title, `${note.title} ${note.body}`),
      }))
      .filter((entry): entry is { note: Note; score: number } => entry.score !== null)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.note);
  }, [notebook, query]);

  // Null until the client hydrates (see useNotes) — render nothing rather
  // than flashing an empty list over notes that are actually there.
  if (notebook === null) return null;

  // An explicit pick wins and survives typing in the search box; otherwise
  // the first result is shown, so the detail pane is never blank while
  // notes exist. Derived rather than corrected into state — a selection
  // pointing at a deleted note simply stops resolving.
  const picked = selectedId ? (notebook.notes[selectedId] ?? null) : null;
  const shown = picked ?? filtered[0] ?? null;

  function select(noteId: string) {
    setSelectedId(noteId);
    setComposing(false);
    setEditing(false);
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-[18rem_1fr] md:items-start">
      <aside className="md:sticky md:top-6">
        <button
          type="button"
          onClick={() => {
            setComposing(true);
            setEditing(false);
          }}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {strings.newNote}
        </button>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={strings.searchPlaceholder}
          aria-label={strings.searchPlaceholder}
          className="mt-3 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />

        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            {query.trim() === "" ? strings.empty : strings.noMatches}
          </p>
        ) : (
          <ul
            aria-label={strings.listLabel}
            className="mt-3 divide-y divide-border rounded-2xl border border-border md:max-h-[calc(100vh-12rem)] md:overflow-y-auto"
          >
            {filtered.map((note) => {
              const isShown = shown?.id === note.id;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => select(note.id)}
                    aria-current={isShown ? "true" : undefined}
                    className={`block w-full px-3 py-3 text-left ${
                      isShown ? "bg-accent/10" : "hover:bg-border/40"
                    }`}
                  >
                    <span className="block truncate text-sm font-medium">
                      {note.title || strings.titlePlaceholder}
                    </span>
                    {note.body && (
                      <span className="mt-0.5 block truncate text-xs text-muted">{note.body}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className="rounded-2xl border border-border p-6">
        {composing ? (
          <NoteForm
            note={null}
            targets={targets}
            strings={strings}
            typeLabels={typeLabels}
            autoFocus
            onSave={(draft) => {
              const created = createNote(draft);
              setComposing(false);
              setSelectedId(created.id);
            }}
            onCancel={() => setComposing(false)}
          />
        ) : !shown ? (
          <p className="text-sm text-muted">
            {filtered.length === 0 ? strings.empty : strings.selectPrompt}
          </p>
        ) : editing ? (
          <NoteForm
            note={shown}
            targets={targets}
            strings={strings}
            typeLabels={typeLabels}
            autoFocus
            onSave={(draft) => {
              updateNote(shown.id, draft);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <NoteDetail
            note={shown}
            locale={locale}
            strings={strings}
            typeLabels={typeLabels}
            targetByKey={targetByKey}
            highlights={highlightsForNote(notebook, shown.id)}
            onEdit={() => setEditing(true)}
            onDelete={() => {
              if (!window.confirm(strings.confirmDelete)) return;
              deleteNote(shown.id);
              setSelectedId(null);
            }}
          />
        )}
      </section>
    </div>
  );
}

function NoteDetail({
  note,
  locale,
  strings,
  typeLabels,
  targetByKey,
  highlights,
  onEdit,
  onDelete,
}: {
  note: Note;
  locale: Locale;
  strings: Messages["notes"];
  typeLabels: Record<NoteTarget["kind"], string>;
  targetByKey: Map<string, NoteTarget>;
  highlights: ReturnType<typeof highlightsForNote>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{note.title || strings.titlePlaceholder}</h2>
          <p className="mt-1 text-xs text-muted">
            {strings.updatedLabel}: {new Date(note.updatedAt).toLocaleString(locale)}
          </p>
        </div>
        <div className="flex shrink-0 gap-3 text-xs">
          <button type="button" onClick={onEdit} className="text-muted underline hover:text-foreground">
            {strings.edit}
          </button>
          <button type="button" onClick={onDelete} className="text-muted underline hover:text-foreground">
            {strings.delete}
          </button>
        </div>
      </header>

      {note.body && <p className="mt-4 text-sm whitespace-pre-wrap">{note.body}</p>}

      {note.links.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-medium text-muted">{strings.linksLabel}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {note.links.map((link) => {
              const key = noteLinkKey(link);
              const target = targetByKey.get(key);
              return (
                <li key={key}>
                  {target ? (
                    <Link
                      href={target.href}
                      className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs hover:border-accent"
                    >
                      <span className="text-muted uppercase">{typeLabels[link.kind]}</span>
                      <span>{target.label}</span>
                    </Link>
                  ) : (
                    // The target is gone from the content — show the raw id
                    // rather than dropping the link without a trace.
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                      {link.id}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="text-xs font-medium text-muted">{strings.highlightsLabel}</h3>
          <ul className="mt-2 space-y-2">
            {highlights.map((highlight) => (
              <li key={highlight.id} className="flex items-start justify-between gap-3">
                <Link
                  href={`/${locale}/concepts/${highlight.conceptId}`}
                  className="border-l-2 border-accent pl-3 text-sm text-muted italic hover:text-foreground"
                >
                  {highlight.anchor.exact}
                </Link>
                <button
                  type="button"
                  onClick={() => removeHighlight(highlight.id)}
                  className="shrink-0 text-xs text-muted underline hover:text-foreground"
                >
                  {strings.removeHighlight}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
