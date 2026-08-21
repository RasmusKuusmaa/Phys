import { describe, it, expect } from "vitest";
import { fuzzyMatch } from "./fuzzyMatch";

describe("fuzzyMatch", () => {
  it("matches an exact substring", () => {
    expect(fuzzyMatch("newton", "Newton's second law")).toBe(true);
  });

  it("matches a subsequence with gaps", () => {
    expect(fuzzyMatch("nsl", "Newton's second law")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(fuzzyMatch("FORCE", "force equals mass times acceleration")).toBe(true);
  });

  it("rejects out-of-order characters", () => {
    expect(fuzzyMatch("law second", "Newton's second law")).toBe(false);
  });

  it("rejects characters not present at all", () => {
    expect(fuzzyMatch("xyz", "Newton's second law")).toBe(false);
  });

  it("treats an empty query as matching everything", () => {
    expect(fuzzyMatch("", "anything")).toBe(true);
  });
});
