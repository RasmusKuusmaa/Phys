"use client";

import { useMemo, useState } from "react";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { listSessionsByDate, updateSession, deleteSession } from "@/lib/journal/store";
import type { StudySession, Understanding } from "@/lib/journal/schema";
import { useTestHistory } from "@/lib/testHistory/useTestHistory";
import { listAttemptsByDate } from "@/lib/testHistory/store";
import type { TestAttempt } from "@/lib/testHistory/schema";

const UNDERSTANDING_OPTIONS = [1, 2, 3, 4, 5] as const;

/** YYYY-MM from a YYYY-MM-DD date string. */
function monthOf(date: string): string {
  return date.slice(0, 7);
}

function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const shifted = new Date(Date.UTC(year!, monthIndex! - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function JournalTimeline({
  concepts,
  locale,
  strings,
}: {
  concepts: Concept[];
  locale: Locale;
  strings: Pick<
    Messages["journal"],
    | "history"
    | "noEntries"
    | "previousMonth"
    | "nextMonth"
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
    | "editSession"
    | "deleteSession"
    | "confirmDeleteSession"
    | "cancel"
    | "saveEdit"
    | "minutesLabel"
    | "understandingLabel"
    | "noteLabel"
    | "testAttemptLabel"
  >;
}) {
  const journal = useJournal();
  const testHistory = useTestHistory();
  const [month, setMonth] = useState(() => monthOf(new Date().toISOString().slice(0, 10)));

  const titleById = useMemo(() => new Map(concepts.map((c) => [c.id, c.title[locale]])), [concepts, locale]);

  if (journal === null || testHistory === null) return null;

  const sessionsByDate = new Map(listSessionsByDate(journal));
  const attemptsByDate = new Map(listAttemptsByDate(testHistory));
  // A day can have a test attempt with no logged session (or the other way
  // round), so the timeline's dates are the union of both, not just one.
  const byDate = [...new Set([...sessionsByDate.keys(), ...attemptsByDate.keys()])]
    .filter((date) => monthOf(date) === month)
    .sort((a, b) => b.localeCompare(a))
    .map((date): [string, StudySession[]] => [date, sessionsByDate.get(date) ?? []]);
  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
  });

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{strings.history}</h2>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            aria-label={strings.previousMonth}
            className="rounded-lg border border-border px-2 py-1 hover:border-accent"
          >
            ←
          </button>
          <span className="text-muted">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            aria-label={strings.nextMonth}
            className="rounded-lg border border-border px-2 py-1 hover:border-accent"
          >
            →
          </button>
        </div>
      </div>

      {byDate.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{strings.noEntries}</p>
      ) : (
        <div className="mt-3 space-y-6">
          {byDate.map(([date, sessions]) => {
            const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
            const reflection = journal.days[date]?.reflection;
            const attempts = attemptsByDate.get(date) ?? [];
            return (
              <div key={date}>
                <div className="flex items-baseline justify-between text-xs text-muted">
                  <span>
                    {new Date(`${date}T00:00:00`).toLocaleDateString(locale, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {totalMinutes > 0 && <span>{totalMinutes} min</span>}
                </div>
                {reflection && <p className="mt-1 text-sm italic text-muted">{reflection}</p>}
                <ul className="mt-2 space-y-2">
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      title={titleById.get(session.conceptId) ?? session.conceptId}
                      strings={strings}
                    />
                  ))}
                  {attempts.map((attempt) => (
                    <AttemptRow key={attempt.id} attempt={attempt} label={strings.testAttemptLabel} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/** Read-only, unlike SessionRow — a finished test attempt is a fact about the past, not a note that gets edited or deleted. */
function AttemptRow({ attempt, label }: { attempt: TestAttempt; label: string }) {
  return (
    <li className="rounded-xl border border-dashed border-border p-3 text-sm text-muted">
      {label} · {attempt.percent}%
    </li>
  );
}

function SessionRow({
  session,
  title,
  strings,
}: {
  session: StudySession;
  title: string;
  strings: Pick<
    Messages["journal"],
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
    | "editSession"
    | "deleteSession"
    | "confirmDeleteSession"
    | "cancel"
    | "saveEdit"
    | "minutesLabel"
    | "understandingLabel"
    | "noteLabel"
  >;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [minutes, setMinutes] = useState(session.minutes);
  const [understanding, setUnderstanding] = useState<Understanding>(session.understanding);
  const [note, setNote] = useState(session.note);

  if (editing) {
    return (
      <li className="rounded-xl border border-accent p-3 text-sm">
        <p className="font-medium">{title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label htmlFor={`minutes-${session.id}`} className="text-xs text-muted">
            {strings.minutesLabel}
          </label>
          <input
            id={`minutes-${session.id}`}
            type="number"
            min={1}
            max={600}
            value={minutes}
            onChange={(event) =>
              setMinutes(Math.min(600, Math.max(1, Math.round(Number(event.target.value) || 1))))
            }
            className="w-20 rounded-lg border border-border bg-transparent px-2 py-1 text-sm"
          />
        </div>
        <div className="mt-2">
          <span className="text-xs text-muted">{strings.understandingLabel}</span>
          <div role="group" aria-label={strings.understandingLabel} className="mt-1 flex flex-wrap gap-1.5">
            {UNDERSTANDING_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setUnderstanding(option)}
                aria-pressed={understanding === option}
                className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                  understanding === option
                    ? "border border-accent bg-accent/10 font-medium"
                    : "border border-border text-muted hover:border-accent"
                }`}
              >
                {strings[`understanding${option}`]}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={strings.noteLabel}
          rows={2}
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-2 py-1 text-sm"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              updateSession(session.id, { minutes, understanding, note });
              setEditing(false);
            }}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
          >
            {strings.saveEdit}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-accent"
          >
            {strings.cancel}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-border p-3 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-muted">
          {session.minutes} min · {strings[`understanding${session.understanding}`]}
        </span>
      </div>
      {session.note && <p className="mt-1 text-muted">{session.note}</p>}
      <div className="mt-2 flex gap-3 text-xs">
        <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-foreground">
          {strings.editSession}
        </button>
        {confirmingDelete ? (
          <>
            <span className="text-muted">{strings.confirmDeleteSession}</span>
            <button
              type="button"
              onClick={() => deleteSession(session.id)}
              className="font-medium text-red-600 hover:text-red-700"
            >
              {strings.deleteSession}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-muted hover:text-foreground"
            >
              {strings.cancel}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-muted hover:text-foreground"
          >
            {strings.deleteSession}
          </button>
        )}
      </div>
    </li>
  );
}
