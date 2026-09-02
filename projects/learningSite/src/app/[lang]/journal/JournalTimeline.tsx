"use client";

import { useMemo, useState } from "react";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { listSessionsByDate } from "@/lib/journal/store";

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
  >;
}) {
  const journal = useJournal();
  const [month, setMonth] = useState(() => monthOf(new Date().toISOString().slice(0, 10)));

  const titleById = useMemo(() => new Map(concepts.map((c) => [c.id, c.title[locale]])), [concepts, locale]);

  if (journal === null) return null;

  const byDate = listSessionsByDate(journal).filter(([date]) => monthOf(date) === month);
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
                  <span>{totalMinutes} min</span>
                </div>
                {reflection && <p className="mt-1 text-sm italic text-muted">{reflection}</p>}
                <ul className="mt-2 space-y-2">
                  {sessions.map((session) => (
                    <li key={session.id} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-medium">
                          {titleById.get(session.conceptId) ?? session.conceptId}
                        </span>
                        <span className="text-xs text-muted">
                          {session.minutes} min · {strings[`understanding${session.understanding}`]}
                        </span>
                      </div>
                      {session.note && <p className="mt-1 text-muted">{session.note}</p>}
                    </li>
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
