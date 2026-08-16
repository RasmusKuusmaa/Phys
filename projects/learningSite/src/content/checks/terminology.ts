import type { BannedVariant } from "@/schema";

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

export type TerminologyIssue = {
  type: "banned-variant";
  path: string;
  wrong: string;
  correct: string;
  note: string;
};

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
