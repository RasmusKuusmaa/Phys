import { describe, it, expect } from "vitest";
import { fuzzyMatch, searchScore } from "./fuzzyMatch";

describe("fuzzyMatch", () => {
  it("matches an exact substring", () => {
    expect(fuzzyMatch("newton", "Newton's second law")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(fuzzyMatch("FORCE", "force equals mass times acceleration")).toBe(true);
  });

  it("matches regardless of word order", () => {
    expect(fuzzyMatch("law second", "Newton's second law")).toBe(true);
  });

  it("rejects a scattered-letter abbreviation, unlike a command-palette matcher", () => {
    expect(fuzzyMatch("nsl", "Newton's second law")).toBe(false);
  });

  it("rejects a word that isn't present at all", () => {
    expect(fuzzyMatch("xyz", "Newton's second law")).toBe(false);
  });

  it("treats an empty query as matching everything", () => {
    expect(fuzzyMatch("", "anything")).toBe(true);
  });
});

describe("searchScore", () => {
  it("ranks an exact title match above a merely-containing title", () => {
    const exact = searchScore("newton's second law", "Newton's second law", "");
    const containing = searchScore(
      "newton's second law",
      "A note on Newton's second law",
      "",
    );
    expect(exact).not.toBeNull();
    expect(containing).not.toBeNull();
    expect(exact!).toBeGreaterThan(containing!);
  });

  it("ranks any title match above a body-only match", () => {
    const titleMatch = searchScore("radiation", "Ionizing radiation detection", "");
    const bodyOnlyMatch = searchScore(
      "radiation",
      "Newton's second law",
      "unrelated text that happens to mention radiation once",
    );
    expect(titleMatch).not.toBeNull();
    expect(bodyOnlyMatch).not.toBeNull();
    expect(titleMatch!).toBeGreaterThan(bodyOnlyMatch!);
  });

  it("matches a multi-word query against a title substring", () => {
    expect(
      searchScore("ionizing radiation", "Ionizing radiation detection and dosimetry", ""),
    ).not.toBeNull();
  });

  it("returns null when nothing matches", () => {
    expect(searchScore("xyz", "Newton's second law", "some body text")).toBeNull();
  });
});
