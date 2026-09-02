import type { TextAnchor } from "./schema";

/** How much text either side of the quote is kept to disambiguate repeats. */
export const ANCHOR_CONTEXT = 32;

export type ResolvedRange = { start: number; end: number };

/**
 * Builds an anchor for `[start, end)` of `text`, trimming whitespace off
 * the ends of the selection first — a double-click or a drag past the end
 * of a sentence routinely picks up a trailing space, and storing it would
 * make the quote fail to match after any reflow of the source prose.
 *
 * Returns null when the selection is empty once trimmed.
 */
export function createAnchor(text: string, start: number, end: number): TextAnchor | null {
  const lo = Math.max(0, Math.min(start, end));
  const hi = Math.min(text.length, Math.max(start, end));

  // Walk the ends inward past whitespace rather than trimming the slice,
  // so the recorded offset still points at the first kept character.
  let from = lo;
  let to = hi;
  while (from < to && /\s/.test(text[from]!)) from += 1;
  while (to > from && /\s/.test(text[to - 1]!)) to -= 1;
  if (from >= to) return null;

  return {
    exact: text.slice(from, to),
    prefix: text.slice(Math.max(0, from - ANCHOR_CONTEXT), from),
    suffix: text.slice(to, Math.min(text.length, to + ANCHOR_CONTEXT)),
    start: from,
  };
}

/**
 * Finds where an anchor's quote now sits in `text`, or null if the quote
 * is gone entirely (the highlight is then orphaned — the note keeps the
 * quote, but nothing is painted).
 *
 * Every occurrence of the quote is a candidate. Candidates are ranked by
 * how much of the recorded surrounding context still agrees, and ties are
 * broken by nearness to the original offset. So a phrase repeated verbatim
 * across a page still re-anchors to the paragraph it was highlighted in.
 */
export function resolveAnchor(text: string, anchor: TextAnchor): ResolvedRange | null {
  if (anchor.exact === "") return null;

  let best: ResolvedRange | null = null;
  let bestContext = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let at = text.indexOf(anchor.exact); at !== -1; at = text.indexOf(anchor.exact, at + 1)) {
    const context =
      commonSuffixLength(anchor.prefix, text.slice(Math.max(0, at - anchor.prefix.length), at)) +
      commonPrefixLength(anchor.suffix, text.slice(at + anchor.exact.length));
    const distance = Math.abs(at - anchor.start);

    if (context > bestContext || (context === bestContext && distance < bestDistance)) {
      best = { start: at, end: at + anchor.exact.length };
      bestContext = context;
      bestDistance = distance;
    }
  }

  return best;
}

/** Length of the longest common prefix of `a` and `b`. */
function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i += 1;
  return i;
}

/** Length of the longest common suffix of `a` and `b`. */
function commonSuffixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[a.length - 1 - i] === b[b.length - 1 - i]) i += 1;
  return i;
}

/**
 * Drops any range that overlaps one already kept, so the painter never has
 * to reason about nested or crossing `<mark>` elements. Earlier-starting
 * (then longer) ranges win.
 */
export function dropOverlaps<T extends ResolvedRange>(ranges: T[]): T[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: T[] = [];
  let paintedTo = -1;
  for (const range of sorted) {
    if (range.start >= paintedTo) {
      kept.push(range);
      paintedTo = range.end;
    }
  }
  return kept;
}
