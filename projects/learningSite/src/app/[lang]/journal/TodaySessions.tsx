"use client";

import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { todayDateString } from "@/lib/journal/date";

/**
 * Live off `useJournal` rather than a refresh callback from the entry
 * form — `logSession` dispatches the same "storage" event every store in
 * the app uses, so this re-renders on its own the moment a session lands.
 */
export function TodaySessions({
  concepts,
  locale,
  strings,
}: {
  concepts: Concept[];
  locale: Locale;
  strings: Pick<
    Messages["journal"],
    | "todaysSessions"
    | "noSessionsToday"
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
  >;
}) {
  const journal = useJournal();
  if (journal === null) return null;

  const titleById = new Map(concepts.map((c) => [c.id, c.title[locale]]));
  const today = todayDateString();
  const sessions = Object.values(journal.sessions)
    .filter((s) => s.date === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold">{strings.todaysSessions}</h2>
      {sessions.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{strings.noSessionsToday}</p>
      ) : (
        <ul className="mt-3 space-y-2">
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
      )}
    </section>
  );
}
