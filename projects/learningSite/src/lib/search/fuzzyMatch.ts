/**
 * Whether `query` matches `text` the way a regular search box does: every
 * whitespace-separated word of the query must appear somewhere in `text` as
 * a substring, case-insensitively. Word order doesn't matter, but the
 * letters of each word must be contiguous — this is not a scattered-letter
 * subsequence matcher.
 */
export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  const t = text.toLowerCase();
  return q.split(/\s+/).every((word) => t.includes(word));
}

/**
 * Ranks how well `query` matches a title/body pair, or returns null when it
 * doesn't match at all. Any title match outranks any body-only match — so
 * searching a concept's own name surfaces its concept page above a formula
 * or glossary entry that merely mentions the term in passing.
 */
export function searchScore(query: string, title: string, body: string): number | null {
  const q = query.trim().toLowerCase();
  if (q === "") return 0;
  const titleTier = matchTier(q, title.toLowerCase());
  const bodyTier = matchTier(q, body.toLowerCase());
  if (titleTier === null && bodyTier === null) return null;
  return (titleTier ?? 0) * 100 + (bodyTier ?? 0);
}

function matchTier(q: string, text: string): number | null {
  if (text === q) return 4;
  if (text.startsWith(q)) return 3;
  if (text.includes(q)) return 2;
  const words = q.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((word) => text.includes(word)) ? 1 : null;
}
