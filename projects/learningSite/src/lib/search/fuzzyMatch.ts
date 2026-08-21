/**
 * True if every character of `query` appears in `text`, in the same order,
 * case-insensitively, with gaps allowed — a subsequence matcher (the same
 * technique command palettes use), not full Levenshtein distance.
 */
export function fuzzyMatch(query: string, text: string): boolean {
  if (query.length === 0) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}
