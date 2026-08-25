import { describe, expect, it } from "vitest";
import { findHomoglyphs } from "./homoglyphs";

describe("findHomoglyphs", () => {
  it("passes clean Estonian text including õ, ä, ö and ü", () => {
    const text = "Vektoril ruumis on nii pikkus kui ka suund — jõud, kiirus, nihe.\nüksühene funktsioon";
    expect(findHomoglyphs("a.mdx", text)).toEqual([]);
  });

  it("catches a Cyrillic к hiding in a Latin word", () => {
    // "kompleкstasand" — the fourth letter is U+043A, not Latin k.
    const issues = findHomoglyphs("a.mdx", "See pilt, kompleкstasand, muudab kõike.");
    expect(issues).toHaveLength(1);
    expect(issues[0].codePoint).toBe("U+043A");
    expect(issues[0].line).toBe(1);
  });

  it("reports the 1-based line number so the location is clickable", () => {
    const issues = findHomoglyphs("a.mdx", "line one\nline two\nbаd");
    expect(issues).toHaveLength(1);
    expect(issues[0].line).toBe(3);
  });

  it("allows Greek letters used as physics symbols", () => {
    expect(findHomoglyphs("a.mdx", "the angle θ, with ω and ħ and Δt")).toEqual([]);
  });

  it("flags every occurrence, not just the first", () => {
    expect(findHomoglyphs("a.mdx", "а and е and о")).toHaveLength(3);
  });
});
