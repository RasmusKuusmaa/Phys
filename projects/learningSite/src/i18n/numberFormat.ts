import type { Locale } from "./locales";

const intlLocale: Record<Locale, string> = {
  en: "en-US",
  et: "et-EE",
};

export type NumberFormatOptions = Intl.NumberFormatOptions;

/**
 * Displays a number using the locale's convention: decimal point + comma
 * thousands separator for `en`, decimal comma + space thousands separator
 * for `et`. This governs display only — the answer parser separately
 * accepts both `9,81` and `9.81` as input regardless of locale.
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: NumberFormatOptions,
): string {
  return new Intl.NumberFormat(intlLocale[locale], options).format(value);
}
