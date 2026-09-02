import { z } from "zod";
import { CURRENT_JOURNAL_VERSION, JournalSchema, createEmptyJournal, type Journal } from "./schema";

type Migration = (data: unknown) => unknown;

/**
 * Keyed by the version a stored blob might arrive at — `migrations[1]`
 * would take a v1-shaped journal to v2. Empty today since v1 is current;
 * this is where a future format change hangs its upgrade step, same
 * contract as `src/lib/progress/migrations.ts`.
 */
const migrations: Record<number, Migration> = {};

// nonnegative, not positive — version 0 is a legitimate sentinel for data
// written before versioning existed, and must reach the migration chain
// below rather than get rejected here.
const VersionedSchema = z.object({ version: z.number().int().nonnegative() });

/**
 * Walks a stored blob's `version` forward to `CURRENT_JOURNAL_VERSION` one
 * migration step at a time. Falls back to an empty journal (never throws)
 * whenever the data can't be trusted: no version field, a gap in the
 * migration chain, or a final shape that still doesn't validate.
 */
export function migrateJournal(
  raw: unknown,
  registry: Record<number, Migration> = migrations,
  targetVersion: number = CURRENT_JOURNAL_VERSION,
): Journal {
  const versioned = VersionedSchema.safeParse(raw);
  if (!versioned.success) return createEmptyJournal();

  let data: unknown = raw;
  let version = versioned.data.version;

  while (version < targetVersion) {
    const migrate = registry[version];
    if (!migrate) return createEmptyJournal();
    data = migrate(data);
    version += 1;
  }

  const parsed = JournalSchema.safeParse(data);
  return parsed.success ? parsed.data : createEmptyJournal();
}
