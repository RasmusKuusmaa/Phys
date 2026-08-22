import { z } from "zod";
import { CURRENT_PROGRESS_VERSION, ProgressSchema, createEmptyProgress, type Progress } from "./schema";

type Migration = (data: unknown) => unknown;

/**
 * Keyed by the version a stored blob might arrive at — `migrations[1]`
 * would take a v1-shaped object to v2. Empty today since v1 is still
 * current; this is where a future format change hangs its upgrade step,
 * so old localStorage data gets carried forward instead of silently reset.
 */
const migrations: Record<number, Migration> = {};

// nonnegative, not positive — version 0 is a legitimate sentinel for data
// written before versioning existed, and must reach the migration chain
// below rather than get rejected here.
const VersionedSchema = z.object({ version: z.number().int().nonnegative() });

/**
 * Walks a stored blob's `version` forward to `CURRENT_PROGRESS_VERSION`
 * one migration step at a time. Falls back to an empty progress (never
 * throws) whenever the data can't be trusted: no version field, a gap in
 * the migration chain, or a final shape that still doesn't validate.
 */
export function migrateProgress(
  raw: unknown,
  registry: Record<number, Migration> = migrations,
  targetVersion: number = CURRENT_PROGRESS_VERSION,
): Progress {
  const versioned = VersionedSchema.safeParse(raw);
  if (!versioned.success) return createEmptyProgress();

  let data: unknown = raw;
  let version = versioned.data.version;

  while (version < targetVersion) {
    const migrate = registry[version];
    if (!migrate) return createEmptyProgress();
    data = migrate(data);
    version += 1;
  }

  const parsed = ProgressSchema.safeParse(data);
  return parsed.success ? parsed.data : createEmptyProgress();
}
