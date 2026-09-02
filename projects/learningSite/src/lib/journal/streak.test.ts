import { describe, it, expect } from "vitest";
import { calculateStreak, recentActivity } from "./streak";
import { createEmptyJournal, type Journal } from "./schema";

function journalWithDates(dates: string[]): Journal {
  const journal = createEmptyJournal();
  for (const [index, date] of dates.entries()) {
    journal.sessions[`s${index}`] = {
      id: `s${index}`,
      conceptId: "kinematics-in-one-dimension",
      date,
      minutes: 10,
      understanding: 3,
      note: "",
      createdAt: `${date}T10:00:00.000Z`,
      updatedAt: `${date}T10:00:00.000Z`,
    };
  }
  return journal;
}

describe("calculateStreak", () => {
  it("is zero for an empty journal", () => {
    expect(calculateStreak(createEmptyJournal(), "2026-09-02")).toBe(0);
  });

  it("counts an unbroken run ending today", () => {
    const journal = journalWithDates(["2026-08-31", "2026-09-01", "2026-09-02"]);
    expect(calculateStreak(journal, "2026-09-02")).toBe(3);
  });

  it("keeps yesterday's streak alive with a one-day grace period before today is logged", () => {
    const journal = journalWithDates(["2026-08-31", "2026-09-01"]);
    expect(calculateStreak(journal, "2026-09-02")).toBe(2);
  });

  it("breaks once a full day is skipped", () => {
    const journal = journalWithDates(["2026-08-30", "2026-09-02"]);
    expect(calculateStreak(journal, "2026-09-02")).toBe(1);
  });

  it("stops at a gap in the middle of the run", () => {
    const journal = journalWithDates(["2026-08-29", "2026-08-31", "2026-09-01", "2026-09-02"]);
    expect(calculateStreak(journal, "2026-09-02")).toBe(3);
  });
});

describe("recentActivity", () => {
  it("returns the requested number of days, oldest first, flagged by activity", () => {
    const journal = journalWithDates(["2026-09-01"]);
    const days = recentActivity(journal, 3, "2026-09-02");
    expect(days).toEqual([
      { date: "2026-08-31", active: false },
      { date: "2026-09-01", active: true },
      { date: "2026-09-02", active: false },
    ]);
  });
});
