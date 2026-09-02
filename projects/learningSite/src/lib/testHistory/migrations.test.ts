import { describe, it, expect } from "vitest";
import { migrateTestHistory } from "./migrations";
import { createEmptyTestHistory } from "./schema";

const attempt = {
  id: "a1",
  conceptIds: ["kinematics-in-one-dimension"],
  percent: 80,
  itemCount: 5,
  takenAt: "2026-09-02T10:00:00.000Z",
};

describe("migrateTestHistory", () => {
  it("passes current-version data through unchanged", () => {
    const data = { version: 1, attempts: { a1: attempt } };
    expect(migrateTestHistory(data)).toEqual(data);
  });

  it("falls back to empty history when there's no version field", () => {
    expect(migrateTestHistory({ attempts: {} })).toEqual(createEmptyTestHistory());
    expect(migrateTestHistory(null)).toEqual(createEmptyTestHistory());
    expect(migrateTestHistory("garbage")).toEqual(createEmptyTestHistory());
  });

  it("falls back to empty history when the chain has a gap at the stored version", () => {
    expect(migrateTestHistory({ version: 0, attempts: {} })).toEqual(createEmptyTestHistory());
  });

  it("walks a registered migration forward to the target version", () => {
    const legacy = { version: 0, results: [{ id: "a1" }] };
    const registry = { 0: () => ({ version: 1, attempts: { a1: attempt } }) };
    expect(migrateTestHistory(legacy, registry, 1)).toEqual({
      version: 1,
      attempts: { a1: attempt },
    });
  });

  it("falls back to empty when the migrated shape still doesn't validate", () => {
    const registry = { 0: () => ({ version: 1, attempts: { a1: { id: "a1" } } }) };
    expect(migrateTestHistory({ version: 0 }, registry, 1)).toEqual(createEmptyTestHistory());
  });

  it("rejects an attempt with a percent outside 0-100", () => {
    const data = { version: 1, attempts: { a1: { ...attempt, percent: 120 } } };
    expect(migrateTestHistory(data)).toEqual(createEmptyTestHistory());
  });

  it("rejects an attempt with no concept ids", () => {
    const data = { version: 1, attempts: { a1: { ...attempt, conceptIds: [] } } };
    expect(migrateTestHistory(data)).toEqual(createEmptyTestHistory());
  });
});
