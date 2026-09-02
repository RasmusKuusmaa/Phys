import { z } from "zod";

/**
 * `version` is the discriminant the migration chain walks forward, same
 * contract as `src/lib/notes/schema.ts` and `src/lib/progress/schema.ts`:
 * a blob written by an older build gets carried forward, not reset.
 */
export const CURRENT_JOURNAL_VERSION = 1;

/** YYYY-MM-DD — the journal day a session or reflection belongs to, independent of `createdAt`'s timezone-bearing instant. */
const DateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const UnderstandingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type Understanding = z.infer<typeof UnderstandingSchema>;

/**
 * One logged block of work on one topic. `conceptId` is deliberately a
 * bare concept id, not a `NoteLink`-style `{kind, id}` union — a formula
 * or glossary term always belongs to a concept, so time and understanding
 * are tracked at the concept, never below it.
 */
export const StudySessionSchema = z.object({
  id: z.string().min(1),
  conceptId: z.string().min(1),
  date: DateOnlySchema,
  minutes: z.number().int().positive(),
  understanding: UnderstandingSchema,
  note: z.string().default(""),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type StudySession = z.infer<typeof StudySessionSchema>;

/**
 * At most one freeform reflection per calendar date, independent of how
 * many sessions were logged that day — a day with three topics studied
 * doesn't force three reflections or one awkwardly split three ways.
 */
export const JournalDaySchema = z.object({
  date: DateOnlySchema,
  reflection: z.string(),
  updatedAt: z.string().min(1),
});
export type JournalDay = z.infer<typeof JournalDaySchema>;

export const JournalV1Schema = z.object({
  version: z.literal(1),
  /** Keyed by session id. */
  sessions: z.record(z.string(), StudySessionSchema).default({}),
  /** Keyed by date. */
  days: z.record(z.string(), JournalDaySchema).default({}),
  /** Session id -> ISO timestamp of deletion, same tombstone reasoning as `Notebook.deletedNotes`. */
  deletedSessions: z.record(z.string(), z.string()).default({}),
});
export type JournalV1 = z.infer<typeof JournalV1Schema>;

export const JournalSchema = JournalV1Schema;
export type Journal = JournalV1;

export function createEmptyJournal(): Journal {
  return { version: CURRENT_JOURNAL_VERSION, sessions: {}, days: {}, deletedSessions: {} };
}
