"use client";

import { useMemo, useState } from "react";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import type { Understanding } from "@/lib/journal/schema";
import { logSession } from "@/lib/journal/store";
import { todayDateString } from "@/lib/journal/date";
import { useStudyTimer } from "@/lib/journal/useStudyTimer";

const UNDERSTANDING_OPTIONS = [1, 2, 3, 4, 5] as const;

export function JournalEntryForm({
  concepts,
  locale,
  strings,
  onLogged,
}: {
  concepts: Concept[];
  locale: Locale;
  strings: Messages["journal"];
  /** Called with the logged session's minutes so a parent list (today's sessions, the timeline) can refresh without a full page reload. */
  onLogged?: () => void;
}) {
  const [filter, setFilter] = useState("");
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(15);
  const [understanding, setUnderstanding] = useState<Understanding>(3);
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const timer = useStudyTimer();

  // Same shape as the practice builder's concept filter (TestBuilderForm) —
  // a plain substring match on the localised title is enough at this list
  // size and keeps the two pickers behaving the same way.
  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return needle === ""
      ? concepts
      : concepts.filter((concept) => concept.title[locale].toLowerCase().includes(needle));
  }, [concepts, filter, locale]);

  const selected = conceptId ? concepts.find((c) => c.id === conceptId) : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!conceptId) return;
    logSession({ conceptId, date: todayDateString(), minutes, understanding, note });
    setNote("");
    setConfirmation(true);
    setTimeout(() => setConfirmation(false), 2000);
    onLogged?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="journal-topic-filter" className="block text-xs font-medium text-muted">
          {strings.topicLabel}
        </label>
        <input
          id="journal-topic-filter"
          type="search"
          value={selected ? selected.title[locale] : filter}
          onChange={(event) => {
            setConceptId(null);
            setFilter(event.target.value);
          }}
          placeholder={strings.topicFilterPlaceholder}
          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {!selected && filter.trim() !== "" && (
          <ul className="mt-2 max-h-48 divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {visible.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">{strings.noTopicsMatch}</li>
            ) : (
              visible.slice(0, 50).map((concept) => (
                <li key={concept.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setConceptId(concept.id);
                      setFilter("");
                    }}
                    className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-border/40"
                  >
                    {concept.title[locale]}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="journal-minutes" className="block text-xs font-medium text-muted">
          {strings.minutesLabel}
        </label>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <input
            id="journal-minutes"
            type="number"
            min={1}
            max={600}
            value={minutes}
            onChange={(event) =>
              setMinutes(Math.min(600, Math.max(1, Math.round(Number(event.target.value) || 1))))
            }
            className="w-24 rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          {timer.running ? (
            <button
              type="button"
              onClick={() => setMinutes(timer.stop())}
              className="rounded-lg border border-accent px-3 py-2 text-xs font-medium text-accent hover:bg-accent/10"
            >
              {strings.timerStop}
              {/* Hidden from the accessible name: it ticks every second, and a
                  screen reader re-announcing the button on every tick would be
                  noise, not information. */}
              <span aria-hidden="true"> · {formatElapsed(timer.elapsedSeconds)}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={timer.start}
              className="rounded-lg border border-border px-3 py-2 text-xs hover:border-accent"
            >
              {strings.timerStart}
            </button>
          )}
        </div>
      </div>

      <div>
        <span className="block text-xs font-medium text-muted">{strings.understandingLabel}</span>
        <div role="group" aria-label={strings.understandingLabel} className="mt-1 flex flex-wrap gap-2">
          {UNDERSTANDING_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setUnderstanding(option)}
              aria-pressed={understanding === option}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                understanding === option
                  ? "border border-accent bg-accent/10 font-medium"
                  : "border border-border text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              {strings[`understanding${option}`]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="journal-note" className="block text-xs font-medium text-muted">
          {strings.noteLabel}
        </label>
        <textarea
          id="journal-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!conceptId}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white enabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {strings.logSession}
        </button>
        {!conceptId && <span className="text-xs text-muted">{strings.pickTopicFirst}</span>}
        {confirmation && <span className="text-xs text-emerald-600">{strings.sessionLogged}</span>}
      </div>
    </form>
  );
}

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
