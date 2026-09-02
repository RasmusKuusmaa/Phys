import { describe, it, expect } from "vitest";
import { migrateJournal } from "./migrations";
import { createEmptyJournal } from "./schema";

const session = {
  id: "s1",
  conceptId: "kinematics-in-one-dimension",
  date: "2026-09-02",
  minutes: 25,
  understanding: 3,
  note: "Worked through the derivation.",
  createdAt: "2026-09-02T10:00:00.000Z",
  updatedAt: "2026-09-02T10:00:00.000Z",
};

describe("migrateJournal", () => {
  it("passes current-version data through unchanged", () => {
    const data = {
      version: 1,
      sessions: { s1: session },
      days: {},
      deletedSessions: {},
    };
    expect(migrateJournal(data)).toEqual(data);
  });

  it("falls back to an empty journal when there's no version field", () => {
    expect(migrateJournal({ sessions: {} })).toEqual(createEmptyJournal());
    expect(migrateJournal(null)).toEqual(createEmptyJournal());
    expect(migrateJournal("garbage")).toEqual(createEmptyJournal());
  });

  it("falls back to an empty journal when the chain has a gap at the stored version", () => {
    // No migration registered for version 0 — stands in for data written
    // before versioning existed.
    expect(migrateJournal({ version: 0, sessions: {} })).toEqual(createEmptyJournal());
  });

  it("walks a registered migration forward to the target version", () => {
    const legacy = { version: 0, log: [{ id: "s1" }] };
    const registry = {
      0: () => ({ version: 1, sessions: { s1: session }, days: {}, deletedSessions: {} }),
    };
    expect(migrateJournal(legacy, registry, 1)).toEqual({
      version: 1,
      sessions: { s1: session },
      days: {},
      deletedSessions: {},
    });
  });

  it("falls back to empty when the migrated shape still doesn't validate", () => {
    const registry = { 0: () => ({ version: 1, sessions: { s1: { id: "s1" } } }) };
    expect(migrateJournal({ version: 0 }, registry, 1)).toEqual(createEmptyJournal());
  });

  it("rejects a session with an understanding rating outside 1-5", () => {
    const data = {
      version: 1,
      sessions: { s1: { ...session, understanding: 6 } },
      days: {},
      deletedSessions: {},
    };
    expect(migrateJournal(data)).toEqual(createEmptyJournal());
  });

  it("rejects a session whose date isn't YYYY-MM-DD", () => {
    const data = {
      version: 1,
      sessions: { s1: { ...session, date: "Sep 2 2026" } },
      days: {},
      deletedSessions: {},
    };
    expect(migrateJournal(data)).toEqual(createEmptyJournal());
  });
});
