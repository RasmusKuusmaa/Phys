import type { Journal, StudySession } from "./schema";
import { todayDateString } from "./date";

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function sessionsForConcept(journal: Journal, conceptId: string): StudySession[] {
  return Object.values(journal.sessions).filter((s) => s.conceptId === conceptId);
}

/** Total minutes logged against one topic, optionally restricted to the last `sinceDays` calendar days. */
export function minutesForConcept(
  journal: Journal,
  conceptId: string,
  sinceDays?: number,
  today: string = todayDateString(),
): number {
  let sessions = sessionsForConcept(journal, conceptId);
  if (sinceDays !== undefined) {
    const cutoff = addDays(today, -sinceDays);
    sessions = sessions.filter((s) => s.date >= cutoff);
  }
  return sessions.reduce((sum, s) => sum + s.minutes, 0);
}

/** Total minutes per topic across the whole journal, for ranking or a dashboard. */
export function minutesByConcept(
  journal: Journal,
  sinceDays?: number,
  today: string = todayDateString(),
): Map<string, number> {
  const cutoff = sinceDays === undefined ? undefined : addDays(today, -sinceDays);
  const totals = new Map<string, number>();
  for (const session of Object.values(journal.sessions)) {
    if (cutoff !== undefined && session.date < cutoff) continue;
    totals.set(session.conceptId, (totals.get(session.conceptId) ?? 0) + session.minutes);
  }
  return totals;
}

/** Every understanding rating logged for one topic, oldest first — the trend a sparkline or "is this improving" check reads from. */
export function understandingTrend(journal: Journal, conceptId: string): StudySession["understanding"][] {
  return sessionsForConcept(journal, conceptId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((s) => s.understanding);
}

/** The date of the most recent session on a topic, or null if it's never been logged. */
export function lastStudied(journal: Journal, conceptId: string): string | null {
  const sessions = sessionsForConcept(journal, conceptId);
  if (sessions.length === 0) return null;
  return sessions.reduce((latest, s) => (s.date > latest ? s.date : latest), sessions[0]!.date);
}
