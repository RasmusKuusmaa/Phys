import { describe, it, expect } from "vitest";
import { migrateProgress } from "./migrations";
import { createEmptyProgress } from "./schema";

describe("migrateProgress", () => {
  it("passes current-version data through unchanged", () => {
    const data = {
      version: 1,
      conceptStatus: { "newtons-second-law": "confident" },
      misconceptionHits: { "sign-error": 2 },
    };
    expect(migrateProgress(data)).toEqual(data);
  });

  it("falls back to an empty progress when there's no version field", () => {
    expect(migrateProgress({ conceptStatus: {} })).toEqual(createEmptyProgress());
    expect(migrateProgress(null)).toEqual(createEmptyProgress());
    expect(migrateProgress("garbage")).toEqual(createEmptyProgress());
  });

  it("falls back to an empty progress when the chain has a gap at the stored version", () => {
    // No migration registered for version 0 in the default registry —
    // this stands in for data written before versioning existed.
    expect(migrateProgress({ version: 0, conceptStatus: {} })).toEqual(createEmptyProgress());
  });

  it("walks a registered migration forward to the target version", () => {
    // Stands in for a future v0 -> v1 step; the real ProgressSchema is
    // fixed at version 1 today, so the migration's output must land on
    // that exact shape to validate.
    const legacyData = { version: 0, oldStatusField: { "newtons-second-law": "known" } };
    const registry = {
      0: () => ({
        version: 1,
        conceptStatus: { "newtons-second-law": "confident" },
        misconceptionHits: {},
      }),
    };
    expect(migrateProgress(legacyData, registry, 1)).toEqual({
      version: 1,
      conceptStatus: { "newtons-second-law": "confident" },
      misconceptionHits: {},
    });
  });

  it("falls back to empty when the migrated shape still doesn't validate", () => {
    const registry = { 0: () => ({ version: 1, nonsense: true }) };
    expect(migrateProgress({ version: 0 }, registry, 1)).toEqual(createEmptyProgress());
  });
});
