import "server-only";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./locales";
import en from "./messages/en.json";

export type Messages = typeof en;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => Promise.resolve(en),
  et: () => import("./messages/et.json").then((m) => m.default),
};

/**
 * Reads the `[lang]` root param directly, so callers deep in the tree don't
 * need `lang` prop-drilled through every layout and page.
 */
export async function getDictionary(): Promise<Messages> {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  return dictionaries[locale]();
}
