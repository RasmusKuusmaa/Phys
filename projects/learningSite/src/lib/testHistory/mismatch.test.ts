import { describe, it, expect } from "vitest";
import { ratingMismatch } from "./mismatch";
import type { TestAttempt } from "./schema";

function attempt(percent: number, takenAt: string): TestAttempt {
  return { id: takenAt, conceptIds: ["c1"], percent, itemCount: 10, takenAt };
}

describe("ratingMismatch", () => {
  it("is false when nothing has been studied yet", () => {
    expect(ratingMismatch(undefined, [])).toBe(false);
  });

  it("is false when there are no attempts to compare against", () => {
    expect(ratingMismatch(5, [])).toBe(false);
  });

  it("is false below the confident threshold, no matter how low the score", () => {
    expect(ratingMismatch(3, [attempt(10, "2026-01-01T00:00:00.000Z")])).toBe(false);
  });

  it("is false when the latest attempt clears the threshold", () => {
    expect(ratingMismatch(5, [attempt(75, "2026-01-01T00:00:00.000Z")])).toBe(false);
  });

  it("is true when rated confident but the latest attempt scores low", () => {
    expect(ratingMismatch(4, [attempt(45, "2026-01-01T00:00:00.000Z")])).toBe(true);
  });

  it("is true when rated mastered but the latest attempt scores low", () => {
    expect(ratingMismatch(5, [attempt(45, "2026-01-01T00:00:00.000Z")])).toBe(true);
  });

  it("only looks at the latest attempt, not older ones behind it", () => {
    // Newest-first, matching attemptsForConcept's ordering.
    const attempts = [attempt(80, "2026-01-02T00:00:00.000Z"), attempt(20, "2026-01-01T00:00:00.000Z")];
    expect(ratingMismatch(5, attempts)).toBe(false);
  });
});
