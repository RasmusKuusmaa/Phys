import { areUnitsEquivalent, unitRegistry } from "@/lib/units/registry";

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

export type ParsedAnswer = {
  value: number;
  unit: string | null;
};

/** Splits a numeric value from a trailing unit token, e.g. "9,81 m/s^2" -> { value: 9.81, unit: "m/s^2" }. */
export function parseAnswerWithUnit(input: string): ParsedAnswer | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^([^\s]+)\s*(.*)$/);
  if (!match) return null;

  const [, numericPart, unitPart] = match;
  const value = parseNumericInput(numericPart);
  if (value === null) return null;

  return { value, unit: unitPart ? unitPart.trim() : null };
}

/** Whether the given unit is dimensionally the same as the expected unit (e.g. "km/h" vs "m/s" — different symbol, same dimension family only if declared equivalent in the registry). */
export function answerUnitMatches(givenUnit: string, expectedUnit: string): boolean {
  if (!(givenUnit in unitRegistry) || !(expectedUnit in unitRegistry)) return false;
  return areUnitsEquivalent(givenUnit, expectedUnit);
}
