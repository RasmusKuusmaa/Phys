"use client";

import { useId, useMemo, useState } from "react";
import type { Messages } from "@/i18n/dictionaries";
import { searchScore } from "@/lib/search/fuzzyMatch";
import { noteLinkKey, type Note, type NoteLink, type NoteTarget } from "@/lib/notes/schema";

/** How many link suggestions to show at once — enough to choose from, short enough to scan. */
const MAX_SUGGESTIONS = 8;

export type NoteDraft = { title: string; body: string; links: NoteLink[] };

export function NoteForm({
  note,
  initialLinks = [],
  targets,
  strings,
  typeLabels,
  onSave,
  onCancel,
  autoFocus = false,
}: {
  /** The note being edited, or null to compose a new one. */
  note: Note | null;
  /** Links a new note starts with — e.g. the concept whose page it was made on. */
  initialLinks?: NoteLink[];
  targets: NoteTarget[];
  strings: Messages["notes"];
  typeLabels: Record<NoteTarget["kind"], string>;
  onSave: (draft: NoteDraft) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  const fieldId = useId();
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [links, setLinks] = useState<NoteLink[]>(note?.links ?? initialLinks);
  const [linkQuery, setLinkQuery] = useState("");

  const targetByKey = useMemo(
    () => new Map(targets.map((target) => [noteLinkKey(target), target])),
    [targets],
  );

  const suggestions = useMemo(() => {
    if (linkQuery.trim() === "") return [];
    const chosen = new Set(links.map(noteLinkKey));
    return targets
      .filter((target) => !chosen.has(noteLinkKey(target)))
      .map((target) => ({ target, score: searchScore(linkQuery, target.label, target.label) }))
      .filter((entry): entry is { target: NoteTarget; score: number } => entry.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => entry.target);
  }, [linkQuery, links, targets]);

  function addLink(target: NoteTarget) {
    setLinks((previous) => [...previous, { kind: target.kind, id: target.id }]);
    setLinkQuery("");
  }

  function removeLink(key: string) {
    setLinks((previous) => previous.filter((link) => noteLinkKey(link) !== key));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ title: title.trim(), body: body.trim(), links });
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor={`${fieldId}-title`} className="block text-xs font-medium text-muted">
          {strings.titleLabel}
        </label>
        <input
          id={`${fieldId}-title`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={strings.titlePlaceholder}
          autoFocus={autoFocus}
          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor={`${fieldId}-body`} className="block text-xs font-medium text-muted">
          {strings.bodyLabel}
        </label>
        <textarea
          id={`${fieldId}-body`}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={strings.bodyPlaceholder}
          rows={5}
          className="mt-1 w-full resize-y rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div>
        <span className="block text-xs font-medium text-muted">{strings.linksLabel}</span>
        {links.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {links.map((link) => {
              const key = noteLinkKey(link);
              const target = targetByKey.get(key);
              return (
                <li
                  key={key}
                  className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs"
                >
                  <span className="text-muted uppercase">{typeLabels[link.kind]}</span>
                  {/* A link can outlive its target if content is removed — show the raw id rather than dropping the link silently. */}
                  <span>{target?.label ?? link.id}</span>
                  <button
                    type="button"
                    onClick={() => removeLink(key)}
                    aria-label={strings.removeLink}
                    className="ml-1 text-muted hover:text-foreground"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <input
          type="search"
          value={linkQuery}
          onChange={(event) => setLinkQuery(event.target.value)}
          placeholder={strings.addLink}
          aria-label={strings.addLink}
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
            {suggestions.map((target) => (
              <li key={noteLinkKey(target)}>
                <button
                  type="button"
                  onClick={() => addLink(target)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-border/40"
                >
                  <span className="text-xs text-muted uppercase">{typeLabels[target.kind]}</span>
                  <span>{target.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {strings.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent"
        >
          {strings.cancel}
        </button>
      </div>
    </form>
  );
}
