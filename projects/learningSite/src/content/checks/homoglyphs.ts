/**
 * Catches Cyrillic (and Greek) letters hiding inside Latin-script content.
 *
 * Estonian uses ä, ö, ü and õ, which authors reach for via keyboard layouts,
 * IMEs and copy-paste — and Cyrillic а, е, о, р, с, х, к are visually
 * identical to Latin a, e, o, p, c, x, k in most fonts. A single one silently
 * breaks search, sorting and screen readers while looking perfectly correct in
 * review. This is authoring damage no human proofread reliably catches, so it
 * is checked mechanically.
 *
 * Greek is included for the same reason (ο, ρ, ν) but excludes the letters
 * legitimately used as physics symbols in prose, which are listed below.
 */

/** Greek letters that appear legitimately in physics and maths prose. */
const ALLOWED_GREEK = new Set([
  ..."αβγδεζηθικλμνξοπρστυφχψω",
  ..."ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  "ħ",
]);

const CYRILLIC = /[Ѐ-ӿ]/;
const GREEK = /[Ͱ-Ͽ]/;

export type HomoglyphIssue = {
  filePath: string;
  /** 1-based line number, for a clickable location. */
  line: number;
  character: string;
  codePoint: string;
  context: string;
};

export function findHomoglyphs(filePath: string, text: string): HomoglyphIssue[] {
  const issues: HomoglyphIssue[] = [];
  text.split(/\r?\n/).forEach((lineText, i) => {
    for (let col = 0; col < lineText.length; col++) {
      const ch = lineText[col];
      const isCyrillic = CYRILLIC.test(ch);
      const isStrayGreek = GREEK.test(ch) && !ALLOWED_GREEK.has(ch);
      if (!isCyrillic && !isStrayGreek) continue;
      issues.push({
        filePath,
        line: i + 1,
        character: ch,
        codePoint: `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
        context: lineText.slice(Math.max(0, col - 25), col + 25),
      });
    }
  });
  return issues;
}
