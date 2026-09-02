import { z } from "zod";
import {
  CURRENT_NOTEBOOK_VERSION,
  NotebookSchema,
  createEmptyNotebook,
  type Notebook,
} from "./schema";

type Migration = (data: unknown) => unknown;

/**
 * Keyed by the version a stored blob might arrive at — `migrations[1]`
 * takes a v1-shaped notebook to v2. Same contract as the progress
 * migration registry.
 */
const migrations: Record<number, Migration> = {
  // v1 -> v2: tombstone maps, added when notebooks started syncing between
  // devices. An existing notebook has no record of what it deleted before
  // now, so it starts with none — the effect is that a note deleted on one
  // device *before* this upgrade can still come back from another device
  // once, and never again after.
  1: (data) => ({
    ...(data as object),
    version: 2,
    deletedNotes: {},
    deletedHighlights: {},
  }),
};

// nonnegative, not positive — version 0 is a legitimate sentinel for data
// written before versioning existed and must reach the chain below.
const VersionedSchema = z.object({ version: z.number().int().nonnegative() });

/**
 * Walks a stored notebook's `version` forward to `CURRENT_NOTEBOOK_VERSION`
 * one step at a time. Falls back to an empty notebook (never throws)
 * whenever the data can't be trusted: no version field, a gap in the
 * chain, or a final shape that still doesn't validate.
 */
export function migrateNotebook(
  raw: unknown,
  registry: Record<number, Migration> = migrations,
  targetVersion: number = CURRENT_NOTEBOOK_VERSION,
): Notebook {
  const versioned = VersionedSchema.safeParse(raw);
  if (!versioned.success) return createEmptyNotebook();

  let data: unknown = raw;
  let version = versioned.data.version;

  while (version < targetVersion) {
    const migrate = registry[version];
    if (!migrate) return createEmptyNotebook();
    data = migrate(data);
    version += 1;
  }

  const parsed = NotebookSchema.safeParse(data);
  return parsed.success ? parsed.data : createEmptyNotebook();
}
