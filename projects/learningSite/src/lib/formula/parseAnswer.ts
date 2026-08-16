/**
 * Accepts both `9,81` and `9.81` regardless of locale (display formatting
 * is a separate, locale-aware concern — see `src/i18n/numberFormat.ts`),
 * plus scientific notation like `1.5e3` or `1,5E-4`. Returns `null` rather
 * than throwing, since this runs against live learner input.
 */
export function parseNumericInput(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // A comma is treated as the decimal separator (not a thousands
  // separator) — only one decimal separator is supported per input.
  const normalized = trimmed.replace(",", ".");
  if (!/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(normalized)) return null;

  return parseFloat(normalized);
}
