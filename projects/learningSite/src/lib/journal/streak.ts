import type { Journal } from "./schema";
import { todayDateString } from "./date";

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/**
 * Consecutive days with at least one logged session, counting backward
 * from today.
 *
 * Carries a one-day grace period: if nothing is logged yet today but
 * yesterday continues an unbroken run, the streak still reports that run
 * rather than dropping to zero the instant midnight passes — the streak
 * only actually breaks once a full day goes by with nothing logged.
 */
export function calculateStreak(journal: Journal, today: string = todayDateString()): number {
  const datesWithSessions = new Set(Object.values(journal.sessions).map((s) => s.date));

  let cursor = datesWithSessions.has(today) ? today : addDays(today, -1);
  if (!datesWithSessions.has(cursor)) return 0;

  let streak = 0;
  while (datesWithSessions.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** The last `days` calendar dates (oldest first) with whether each has a logged session — the data a calendar strip renders from. */
export function recentActivity(
  journal: Journal,
  days: number,
  today: string = todayDateString(),
): { date: string; active: boolean }[] {
  const datesWithSessions = new Set(Object.values(journal.sessions).map((s) => s.date));
  const result: { date: string; active: boolean }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = addDays(today, -i);
    result.push({ date, active: datesWithSessions.has(date) });
  }
  return result;
}
