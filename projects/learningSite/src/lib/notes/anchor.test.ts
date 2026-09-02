import { describe, it, expect } from "vitest";
import { createAnchor, resolveAnchor, dropOverlaps } from "./anchor";
import type { TextAnchor } from "./schema";

const PROSE =
  "A force is a push or a pull. The net force on a body equals its mass times " +
  "its acceleration. Without a net force the body keeps its velocity.";

/** Anchors the first occurrence of `quote` in `text`, the way a selection would. */
function anchorFor(text: string, quote: string, occurrence = 0): TextAnchor {
  let at = -1;
  for (let i = 0; i <= occurrence; i++) at = text.indexOf(quote, at + 1);
  const anchor = createAnchor(text, at, at + quote.length);
  if (!anchor) throw new Error(`could not anchor "${quote}"`);
  return anchor;
}

describe("createAnchor", () => {
  it("captures the quote with surrounding context", () => {
    const anchor = anchorFor(PROSE, "net force");
    expect(anchor.exact).toBe("net force");
    expect(PROSE.slice(anchor.start, anchor.start + anchor.exact.length)).toBe("net force");
    expect(anchor.prefix.endsWith("The ")).toBe(true);
    expect(anchor.suffix.startsWith(" on a body")).toBe(true);
  });

  it("trims whitespace off a sloppy selection and reports the trimmed offset", () => {
    const text = "alpha beta gamma";
    const anchor = createAnchor(text, 5, 11); // " beta "
    expect(anchor?.exact).toBe("beta");
    expect(anchor?.start).toBe(6);
  });

  it("accepts a backwards selection", () => {
    const anchor = createAnchor("alpha beta", 10, 6);
    expect(anchor?.exact).toBe("beta");
  });

  it("returns null for an empty or whitespace-only selection", () => {
    expect(createAnchor(PROSE, 5, 5)).toBeNull();
    expect(createAnchor("alpha   beta", 5, 8)).toBeNull();
  });

  it("clamps a selection that runs past the end of the text", () => {
    const anchor = createAnchor("alpha", 0, 999);
    expect(anchor?.exact).toBe("alpha");
  });
});

describe("resolveAnchor", () => {
  it("round-trips an anchor against unchanged text", () => {
    const anchor = anchorFor(PROSE, "mass times");
    expect(resolveAnchor(PROSE, anchor)).toEqual({
      start: PROSE.indexOf("mass times"),
      end: PROSE.indexOf("mass times") + "mass times".length,
    });
  });

  it("re-anchors after text is inserted above the quote", () => {
    const anchor = anchorFor(PROSE, "mass times");
    const edited = "A new opening sentence was added here. " + PROSE;
    const resolved = resolveAnchor(edited, anchor);
    expect(resolved).not.toBeNull();
    expect(edited.slice(resolved!.start, resolved!.end)).toBe("mass times");
    // Proves it followed the words rather than staying at the stored offset.
    expect(resolved!.start).not.toBe(anchor.start);
  });

  it("picks the repeat whose surrounding context matches", () => {
    // "net force" appears twice; anchor the second one.
    const anchor = anchorFor(PROSE, "net force", 1);
    const resolved = resolveAnchor(PROSE, anchor);
    expect(resolved!.start).toBe(PROSE.indexOf("net force", PROSE.indexOf("net force") + 1));
  });

  it("falls back to the nearest occurrence when context is identical", () => {
    const text = "same words here. same words here. same words here.";
    const anchor = anchorFor(text, "same words", 2);
    const resolved = resolveAnchor(text, anchor);
    // Third occurrence — context ties, so the stored offset breaks it.
    expect(resolved!.start).toBe(text.lastIndexOf("same words"));
  });

  it("returns null when the quote is gone, rather than guessing", () => {
    const anchor = anchorFor(PROSE, "mass times");
    expect(resolveAnchor("Completely different prose entirely.", anchor)).toBeNull();
  });

  it("returns null for an empty quote", () => {
    expect(resolveAnchor(PROSE, { exact: "", prefix: "", suffix: "", start: 0 })).toBeNull();
  });
});

describe("dropOverlaps", () => {
  it("keeps disjoint ranges in document order", () => {
    const ranges = [
      { start: 10, end: 20 },
      { start: 0, end: 5 },
    ];
    expect(dropOverlaps(ranges)).toEqual([
      { start: 0, end: 5 },
      { start: 10, end: 20 },
    ]);
  });

  it("drops a range overlapping one already kept", () => {
    const ranges = [
      { start: 0, end: 10 },
      { start: 5, end: 15 },
    ];
    expect(dropOverlaps(ranges)).toEqual([{ start: 0, end: 10 }]);
  });

  it("keeps the longer range when two start together", () => {
    const ranges = [
      { start: 0, end: 4 },
      { start: 0, end: 9 },
    ];
    expect(dropOverlaps(ranges)).toEqual([{ start: 0, end: 9 }]);
  });

  it("treats abutting ranges as disjoint", () => {
    const ranges = [
      { start: 0, end: 5 },
      { start: 5, end: 9 },
    ];
    expect(dropOverlaps(ranges)).toHaveLength(2);
  });
});
