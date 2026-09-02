import { describe, it, expect } from "vitest";
import { migrateNotebook } from "./migrations";
import { createEmptyNotebook } from "./schema";

const note = {
  id: "n1",
  title: "Dead time",
  body: "Counts lost while the tube recovers.",
  links: [{ kind: "concept", id: "ionizing-radiation-detection-and-dosimetry" }],
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-01T10:00:00.000Z",
};

describe("migrateNotebook", () => {
  it("passes current-version data through unchanged", () => {
    const data = {
      version: 2,
      notes: { n1: note },
      highlights: {},
      deletedNotes: {},
      deletedHighlights: {},
    };
    expect(migrateNotebook(data)).toEqual(data);
  });

  it("carries a v1 notebook forward to v2, keeping its notes", () => {
    // The real upgrade path: someone who took notes before sync existed
    // must not lose them when tombstones were introduced.
    const v1 = { version: 1, notes: { n1: note }, highlights: {} };
    expect(migrateNotebook(v1)).toEqual({
      version: 2,
      notes: { n1: note },
      highlights: {},
      deletedNotes: {},
      deletedHighlights: {},
    });
  });

  it("falls back to an empty notebook when there's no version field", () => {
    expect(migrateNotebook({ notes: {} })).toEqual(createEmptyNotebook());
    expect(migrateNotebook(null)).toEqual(createEmptyNotebook());
    expect(migrateNotebook("garbage")).toEqual(createEmptyNotebook());
  });

  it("falls back to an empty notebook when the chain has a gap at the stored version", () => {
    // No migration registered for version 0 — stands in for data written
    // before versioning existed.
    expect(migrateNotebook({ version: 0, notes: {} })).toEqual(createEmptyNotebook());
  });

  it("walks a registered migration forward to the target version", () => {
    const legacy = { version: 0, jottings: { n1: "dead time" } };
    const registry = {
      0: () => ({
        version: 2,
        notes: { n1: note },
        highlights: {},
        deletedNotes: {},
        deletedHighlights: {},
      }),
    };
    expect(migrateNotebook(legacy, registry, 1)).toEqual({
      version: 2,
      notes: { n1: note },
      highlights: {},
      deletedNotes: {},
      deletedHighlights: {},
    });
  });

  it("falls back to empty when the migrated shape still doesn't validate", () => {
    const registry = { 0: () => ({ version: 2, notes: { n1: { id: "n1" } } }) };
    expect(migrateNotebook({ version: 0 }, registry, 1)).toEqual(createEmptyNotebook());
  });

  it("rejects a highlight whose locale isn't a real locale", () => {
    const data = {
      version: 2,
      notes: { n1: note },
      deletedNotes: {},
      deletedHighlights: {},
      highlights: {
        h1: {
          id: "h1",
          noteId: "n1",
          conceptId: "c1",
          locale: "de",
          containerKey: "explanation",
          anchor: { exact: "x", prefix: "", suffix: "", start: 0 },
          createdAt: "2026-09-01T10:00:00.000Z",
        },
      },
    };
    expect(migrateNotebook(data)).toEqual(createEmptyNotebook());
  });
});
