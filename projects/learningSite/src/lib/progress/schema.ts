import { z } from "zod";

/**
 * No accounts, no backend (see todo.md) — progress lives entirely in the
 * browser's localStorage. `version` is a discriminant for the migration
 * path (Phase 10): a stored blob with an older version gets migrated
 * forward rather than discarded.
 */
export const CURRENT_PROGRESS_VERSION = 1;

export const ConceptStatusSchema = z.enum(["unseen", "learning", "confident"]);
export type ConceptStatus = z.infer<typeof ConceptStatusSchema>;

export const ProgressV1Schema = z.object({
  version: z.literal(1),
  /** Keyed by concept id. A concept with no entry is treated as "unseen". */
  conceptStatus: z.record(z.string(), ConceptStatusSchema).default({}),
  /** Keyed by misconception id — how many times a practice session has hit it. */
  misconceptionHits: z.record(z.string(), z.number().int().nonnegative()).default({}),
});
export type ProgressV1 = z.infer<typeof ProgressV1Schema>;

export const ProgressSchema = ProgressV1Schema;
export type Progress = ProgressV1;

export function createEmptyProgress(): Progress {
  return { version: CURRENT_PROGRESS_VERSION, conceptStatus: {}, misconceptionHits: {} };
}
