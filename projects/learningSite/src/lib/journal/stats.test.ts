import { describe, it, expect } from "vitest";
import { minutesForConcept, minutesByConcept, understandingTrend, lastStudied } from "./stats";
import { createEmptyJournal, type Journal, type Understanding } from "./schema";

function session(
  id: string,
  conceptId: string,
  date: string,
  minutes: number,
  understanding: Understanding,
) {
  return {
    id,
    conceptId,
    date,
    minutes,
    understanding,
    note: "",
    createdAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

function journalWith(sessions: ReturnType<typeof session>[]): Journal {
  const journal = createEmptyJournal();
  for (const s of sessions) journal.sessions[s.id] = s;
  return journal;
}

describe("minutesForConcept", () => {
  it("sums all sessions for a topic", () => {
    const journal = journalWith([
      session("s1", "kinematics", "2026-08-01", 20, 3),
      session("s2", "kinematics", "2026-08-15", 30, 4),
      session("s3", "thermodynamics", "2026-08-15", 15, 3),
    ]);
    expect(minutesForConcept(journal, "kinematics")).toBe(50);
  });

  it("restricts to the last N days when given sinceDays", () => {
    const journal = journalWith([
      session("s1", "kinematics", "2026-08-01", 20, 3),
      session("s2", "kinematics", "2026-09-01", 30, 4),
    ]);
    expect(minutesForConcept(journal, "kinematics", 7, "2026-09-02")).toBe(30);
    expect(minutesForConcept(journal, "kinematics", 0, "2026-09-02")).toBe(0);
  });
});

describe("minutesByConcept", () => {
  it("totals minutes per topic across the whole journal", () => {
    const journal = journalWith([
      session("s1", "kinematics", "2026-08-01", 20, 3),
      session("s2", "kinematics", "2026-08-02", 10, 3),
      session("s3", "thermodynamics", "2026-08-02", 15, 3),
    ]);
    const totals = minutesByConcept(journal);
    expect(totals.get("kinematics")).toBe(30);
    expect(totals.get("thermodynamics")).toBe(15);
  });
});

describe("understandingTrend", () => {
  it("returns ratings oldest first", () => {
    const journal = journalWith([
      { ...session("s1", "kinematics", "2026-08-02", 10, 4), createdAt: "2026-08-02T10:00:00.000Z" },
      { ...session("s2", "kinematics", "2026-08-01", 10, 2), createdAt: "2026-08-01T10:00:00.000Z" },
    ]);
    expect(understandingTrend(journal, "kinematics")).toEqual([2, 4]);
  });
});

describe("lastStudied", () => {
  it("returns null when a topic has never been logged", () => {
    expect(lastStudied(createEmptyJournal(), "kinematics")).toBeNull();
  });

  it("returns the most recent session date", () => {
    const journal = journalWith([
      session("s1", "kinematics", "2026-08-01", 10, 3),
      session("s2", "kinematics", "2026-08-20", 10, 3),
    ]);
    expect(lastStudied(journal, "kinematics")).toBe("2026-08-20");
  });
});
