"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { minutesByConcept, understandingTrend, lastStudied } from "@/lib/journal/stats";
import { todayDateString } from "@/lib/journal/date";

const STALE_AFTER_DAYS = 14;
const TOP_TOPICS_LIMIT = 5;

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function JournalOverview({
  concepts,
  locale,
  strings,
}: {
  concepts: Concept[];
  locale: Locale;
  strings: Pick<
    Messages["journal"],
    | "topTopicsHeading"
    | "noTopTopics"
    | "staleTopicsHeading"
    | "noStaleTopics"
    | "moduleUnderstandingHeading"
    | "noModuleData"
    | "understanding1"
    | "understanding2"
    | "understanding3"
    | "understanding4"
    | "understanding5"
  >;
}) {
  const journal = useJournal();
  const conceptById = useMemo(() => new Map(concepts.map((c) => [c.id, c])), [concepts]);

  if (journal === null) return null;
  const today = todayDateString();

  const topTopics = [...minutesByConcept(journal, 7).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TOPICS_LIMIT)
    .map(([conceptId, minutes]) => ({ conceptId, minutes, concept: conceptById.get(conceptId) }))
    .filter((row): row is { conceptId: string; minutes: number; concept: Concept } => Boolean(row.concept));

  const staleTopics = Object.keys(
    Object.fromEntries(Object.values(journal.sessions).map((s) => [s.conceptId, true])),
  )
    .map((conceptId) => ({ conceptId, last: lastStudied(journal, conceptId), concept: conceptById.get(conceptId) }))
    .filter(
      (row): row is { conceptId: string; last: string; concept: Concept } =>
        Boolean(row.concept) && row.last !== null && daysBetween(row.last, today) > STALE_AFTER_DAYS,
    )
    .sort((a, b) => daysBetween(b.last, today) - daysBetween(a.last, today))
    .slice(0, TOP_TOPICS_LIMIT);

  const moduleRatings = new Map<string, number[]>();
  for (const concept of concepts) {
    const trend = understandingTrend(journal, concept.id);
    if (trend.length === 0) continue;
    const list = moduleRatings.get(concept.module) ?? [];
    list.push(trend.at(-1)!);
    moduleRatings.set(concept.module, list);
  }
  const moduleAverages = [...moduleRatings.entries()]
    .map(([module, ratings]) => ({
      module,
      average: Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length) as 1 | 2 | 3 | 4 | 5,
    }))
    .sort((a, b) => a.module.localeCompare(b.module));

  return (
    <section className="mt-10 grid gap-6 sm:grid-cols-2">
      <div>
        <h2 className="text-sm font-semibold">{strings.topTopicsHeading}</h2>
        {topTopics.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{strings.noTopTopics}</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {topTopics.map(({ conceptId, minutes, concept }) => (
              <li key={conceptId} className="flex justify-between gap-3">
                <Link href={`/${locale}/concepts/${conceptId}`} className="truncate hover:text-accent">
                  {concept.title[locale]}
                </Link>
                <span className="shrink-0 text-muted">{minutes} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold">{strings.staleTopicsHeading}</h2>
        {staleTopics.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{strings.noStaleTopics}</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {staleTopics.map(({ conceptId, last, concept }) => (
              <li key={conceptId} className="flex justify-between gap-3">
                <Link href={`/${locale}/concepts/${conceptId}`} className="truncate hover:text-accent">
                  {concept.title[locale]}
                </Link>
                <span className="shrink-0 text-muted">{daysBetween(last, today)}d</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sm:col-span-2">
        <h2 className="text-sm font-semibold">{strings.moduleUnderstandingHeading}</h2>
        {moduleAverages.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{strings.noModuleData}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {moduleAverages.map(({ module, average }) => (
              <li
                key={module}
                className="rounded-full border border-border px-3 py-1 text-xs"
                title={strings[`understanding${average}`]}
              >
                {module}: {strings[`understanding${average}`]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
