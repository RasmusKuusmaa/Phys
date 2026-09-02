"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { minutesForConcept, understandingTrend, lastStudied } from "@/lib/journal/stats";
import { useTestHistory } from "@/lib/testHistory/useTestHistory";
import { attemptsForConcept } from "@/lib/testHistory/store";

const RECENT_ATTEMPTS_LIMIT = 5;

/** Null until the client hydrates (see useJournal) — renders nothing rather than guessing, so there's no flash of "never studied" for someone who has. */
export function StudyStats({
  conceptId,
  locale,
  strings,
}: {
  conceptId: string;
  locale: Locale;
  strings: Pick<
    Messages["journal"],
    | "studyHeading"
    | "totalTimeLabel"
    | "lastStudiedLabel"
    | "latestUnderstandingLabel"
    | "neverStudied"
    | "testYourself"
    | "recentAttemptsLabel"
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
  >;
}) {
  const journal = useJournal();
  const testHistory = useTestHistory();
  if (journal === null || testHistory === null) return null;

  const totalMinutes = minutesForConcept(journal, conceptId);
  const last = lastStudied(journal, conceptId);
  const trend = understandingTrend(journal, conceptId);
  const latest = trend.at(-1);
  const attempts = attemptsForConcept(testHistory, conceptId).slice(0, RECENT_ATTEMPTS_LIMIT);

  const testLink = (
    <Link
      href={`/${locale}/practice?concepts=${conceptId}`}
      className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-hover"
    >
      {strings.testYourself}
    </Link>
  );

  const attemptsList = attempts.length > 0 && (
    <div className="mt-3">
      <p className="text-xs text-muted">{strings.recentAttemptsLabel}</p>
      <ul className="mt-1 flex flex-wrap gap-2">
        {attempts.map((attempt) => (
          <li
            key={attempt.id}
            title={new Date(attempt.takenAt).toLocaleDateString(locale)}
            className="rounded-full border border-border px-2.5 py-1 text-xs"
          >
            {attempt.percent}%
          </li>
        ))}
      </ul>
    </div>
  );

  if (totalMinutes === 0 || last === null) {
    return (
      <div className="mt-6 rounded-2xl border border-border p-4">
        <h2 className="text-sm font-semibold">{strings.studyHeading}</h2>
        <p className="mt-2 text-sm text-muted">{strings.neverStudied}</p>
        {attemptsList}
        {testLink}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-border p-4">
      <h2 className="text-sm font-semibold">{strings.studyHeading}</h2>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted">{strings.totalTimeLabel}</dt>
          <dd>{totalMinutes} min</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{strings.lastStudiedLabel}</dt>
          <dd>{new Date(`${last}T00:00:00`).toLocaleDateString(locale)}</dd>
        </div>
        {latest !== undefined && (
          <div>
            <dt className="text-xs text-muted">{strings.latestUnderstandingLabel}</dt>
            <dd>{strings[`understanding${latest}`]}</dd>
          </div>
        )}
      </dl>
      {attemptsList}
      {testLink}
    </div>
  );
}
