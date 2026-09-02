"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { minutesForConcept, understandingTrend, lastStudied } from "@/lib/journal/stats";

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
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
  >;
}) {
  const journal = useJournal();
  if (journal === null) return null;

  const totalMinutes = minutesForConcept(journal, conceptId);
  const last = lastStudied(journal, conceptId);
  const trend = understandingTrend(journal, conceptId);
  const latest = trend.at(-1);

  const testLink = (
    <Link
      href={`/${locale}/practice?concepts=${conceptId}`}
      className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-hover"
    >
      {strings.testYourself}
    </Link>
  );

  if (totalMinutes === 0 || last === null) {
    return (
      <div className="mt-6 rounded-2xl border border-border p-4">
        <h2 className="text-sm font-semibold">{strings.studyHeading}</h2>
        <p className="mt-2 text-sm text-muted">{strings.neverStudied}</p>
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
      {testLink}
    </div>
  );
}
