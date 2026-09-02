"use client";

import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { calculateStreak, recentActivity } from "@/lib/journal/streak";

const STRIP_DAYS = 14;

export function StreakCalendar({
  locale,
  strings,
}: {
  locale: Locale;
  strings: Pick<Messages["journal"], "streakLabel" | "noStreak">;
}) {
  const journal = useJournal();
  if (journal === null) return null;

  const streak = calculateStreak(journal);
  const days = recentActivity(journal, STRIP_DAYS);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm font-medium">
        {streak > 0 ? `${streak} ${strings.streakLabel}` : strings.noStreak}
      </p>
      <div className="flex gap-1">
        {days.map(({ date, active }) => (
          <span
            key={date}
            title={new Date(`${date}T00:00:00`).toLocaleDateString(locale)}
            className={`h-3 w-3 rounded-sm ${active ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
