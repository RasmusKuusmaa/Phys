import { z } from "zod";
import {
  CURRENT_TEST_HISTORY_VERSION,
  TestHistorySchema,
  createEmptyTestHistory,
  type TestHistory,
} from "./schema";

type Migration = (data: unknown) => unknown;

/** Empty today since v1 is current — same contract as `src/lib/journal/migrations.ts`. */
const migrations: Record<number, Migration> = {};

// nonnegative, not positive — version 0 is a legitimate sentinel for data
// written before versioning existed, and must reach the migration chain
// below rather than get rejected here.
const VersionedSchema = z.object({ version: z.number().int().nonnegative() });

/**
 * Walks a stored blob's `version` forward to `CURRENT_TEST_HISTORY_VERSION`
 * one migration step at a time. Falls back to empty history (never throws)
 * whenever the data can't be trusted: no version field, a gap in the
 * migration chain, or a final shape that still doesn't validate.
 */
export function migrateTestHistory(
  raw: unknown,
  registry: Record<number, Migration> = migrations,
  targetVersion: number = CURRENT_TEST_HISTORY_VERSION,
): TestHistory {
  const versioned = VersionedSchema.safeParse(raw);
  if (!versioned.success) return createEmptyTestHistory();

  let data: unknown = raw;
  let version = versioned.data.version;

  while (version < targetVersion) {
    const migrate = registry[version];
    if (!migrate) return createEmptyTestHistory();
    data = migrate(data);
    version += 1;
  }

  const parsed = TestHistorySchema.safeParse(data);
  return parsed.success ? parsed.data : createEmptyTestHistory();
}
