import type { BannedVariant, GlossaryEntry } from "@/schema";

function isLocalisedTextShape(value: unknown): value is { en: string; et: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).en === "string" &&
    typeof (value as Record<string, unknown>).et === "string"
  );
}

function collectEstonianStrings(node: unknown, pathPrefix = ""): { path: string; et: string }[] {
  const found: { path: string; et: string }[] = [];
  if (Array.isArray(node)) {
    node.forEach((item, i) =>
      found.push(...collectEstonianStrings(item, `${pathPrefix}[${i}]`)),
    );
    return found;
  }
  if (node && typeof node === "object") {
    if (isLocalisedTextShape(node)) {
      found.push({ path: pathPrefix, et: node.et });
      return found;
    }
    for (const [key, value] of Object.entries(node)) {
      found.push(
        ...collectEstonianStrings(value, pathPrefix ? `${pathPrefix}.${key}` : key),
      );
    }
  }
  return found;
}

export type TerminologyIssue =
  | { type: "banned-variant"; path: string; wrong: string; correct: string; note: string }
  | { type: "untranslated-term"; path: string; term: string };

/** Flags Estonian content text that contains a banned wrong rendering of a locked term (whole-word match, case-insensitive). */
export function lintBannedVariants(
  files: { filePath: string; data: unknown }[],
  bannedVariants: BannedVariant[],
): TerminologyIssue[] {
  const issues: TerminologyIssue[] = [];
  for (const file of files) {
    const strings = collectEstonianStrings(file.data);
    for (const { path: fieldPath, et } of strings) {
      for (const variant of bannedVariants) {
        // Plain \b treats only ASCII as "word" characters, so it misreads
        // boundaries around ä/õ/ü/ö — use Unicode letter/number lookaround instead.
        const pattern = new RegExp(
          `(?<![\\p{L}\\p{N}])${escapeRegExp(variant.wrong)}(?![\\p{L}\\p{N}])`,
          "iu",
        );
        if (pattern.test(et)) {
          issues.push({
            type: "banned-variant",
            path: `${file.filePath}#${fieldPath}`,
            wrong: variant.wrong,
            correct: variant.correct,
            note: variant.note,
          });
        }
      }
    }
  }
  return issues;
}

/**
 * Duck-typed rather than importing the (Phase 2) `Formula` schema: any
 * `symbols` array with `name.en` string entries counts, regardless of
 * which content schema it came from.
 */
function collectSymbolNames(node: unknown, pathPrefix = ""): { path: string; en: string }[] {
  const found: { path: string; en: string }[] = [];
  if (Array.isArray(node)) {
    node.forEach((item, i) => found.push(...collectSymbolNames(item, `${pathPrefix}[${i}]`)));
    return found;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "symbols" && Array.isArray(value)) {
        value.forEach((symbol, i) => {
          const en = (symbol as { name?: { en?: unknown } })?.name?.en;
          if (typeof en === "string") {
            found.push({ path: `${pathPrefix}${pathPrefix ? "." : ""}symbols[${i}].name.en`, en });
          }
        });
      } else {
        found.push(...collectSymbolNames(value, pathPrefix ? `${pathPrefix}.${key}` : key));
      }
    }
  }
  return found;
}

/** Flags formula symbol names that have no matching glossary entry — terminology must be locked before content uses it. */
export function lintUntranslatedTerms(
  files: { filePath: string; data: unknown }[],
  glossary: GlossaryEntry[],
): TerminologyIssue[] {
  const glossaryTerms = new Set(glossary.map((g) => g.en.toLowerCase()));
  const issues: TerminologyIssue[] = [];
  for (const file of files) {
    for (const { path: fieldPath, en } of collectSymbolNames(file.data)) {
      if (!glossaryTerms.has(en.toLowerCase())) {
        issues.push({
          type: "untranslated-term",
          path: `${file.filePath}#${fieldPath}`,
          term: en,
        });
      }
    }
  }
  return issues;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
