import { z } from "zod";

export const CURRENT_TEST_HISTORY_VERSION = 1;

/**
 * One finished test, kept forever once taken — unlike a session or a
 * reflection, an attempt is a fact about the past, not a note that gets
 * edited. This is what lets the journal show whether a self-rating
 * matches actual test performance instead of just trusting the rating.
 */
export const TestAttemptSchema = z.object({
  id: z.string().min(1),
  /** A test can cover more than one concept, so this is a list even for a single-concept run. */
  conceptIds: z.array(z.string().min(1)).min(1),
  percent: z.number().min(0).max(100),
  itemCount: z.number().int().positive(),
  takenAt: z.string().min(1),
});
export type TestAttempt = z.infer<typeof TestAttemptSchema>;

export const TestHistoryV1Schema = z.object({
  version: z.literal(1),
  /** Keyed by attempt id. */
  attempts: z.record(z.string(), TestAttemptSchema).default({}),
});
export type TestHistoryV1 = z.infer<typeof TestHistoryV1Schema>;

export const TestHistorySchema = TestHistoryV1Schema;
export type TestHistory = TestHistoryV1;

export function createEmptyTestHistory(): TestHistory {
  return { version: CURRENT_TEST_HISTORY_VERSION, attempts: {} };
}
