import type { Understanding } from "@/lib/journal/schema";
import type { TestAttempt } from "./schema";

/** A self-rating of "confident" or better that a low test score should call into question. */
const CONFIDENT_THRESHOLD: Understanding = 4;
const LOW_SCORE_THRESHOLD = 60;

/**
 * True when a self-rating and the most recent test score visibly
 * disagree — rated "confident" or "mastered" but the last attempt scored
 * under the threshold. Only the latest attempt counts: an old low score
 * behind a since-improved one isn't a live disagreement anymore.
 *
 * This is a plain heads-up, not a verdict — a self-rating and one test's
 * worth of questions measure different things, so it only flags the case
 * where they visibly pull apart, never blocks or corrects either number.
 */
export function ratingMismatch(
  latestUnderstanding: Understanding | undefined,
  recentAttempts: TestAttempt[],
): boolean {
  if (latestUnderstanding === undefined || latestUnderstanding < CONFIDENT_THRESHOLD) return false;
  const latestAttempt = recentAttempts[0];
  return latestAttempt !== undefined && latestAttempt.percent < LOW_SCORE_THRESHOLD;
}
