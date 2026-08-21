import type { Resource } from "@/schema";
import type { Locale } from "@/i18n/locales";

const TYPE_ORDER: Resource["type"][] = ["article", "video", "interactive", "paper", "book"];

export const RESOURCE_TYPE_LABELS: Record<Resource["type"], string> = {
  article: "Articles",
  video: "Videos",
  interactive: "Interactive",
  paper: "Papers",
  book: "Books",
};

export type ResourceGroup = {
  type: Resource["type"];
  resources: Resource[];
};

/**
 * Resources are curated per locale, not translated (see todo.md), so a
 * concept's EN and ET resource sets are genuinely different — grouping by
 * type keeps that difference visible instead of hiding one language behind
 * a locale filter. Within each type, `preferredLocale` sorts first so a
 * reader sees their own language before the other one.
 */
export function groupResourcesByType(
  resources: Resource[],
  preferredLocale: Locale,
): ResourceGroup[] {
  return TYPE_ORDER.filter((type) => resources.some((r) => r.type === type)).map((type) => ({
    type,
    resources: resources
      .filter((r) => r.type === type)
      .sort((a, b) => Number(b.locale === preferredLocale) - Number(a.locale === preferredLocale)),
  }));
}
