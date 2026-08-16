import { locales } from "@/i18n/locales";
import type { Concept, Resource } from "@/schema";

export type MissingLocaleStringIssue = {
  type: "missing-locale-string";
  conceptId: string;
  field: "title" | "summary";
  locale: string;
};

export type MissingResourceLocaleIssue = {
  type: "missing-resource-locale";
  conceptId: string;
  locale: string;
};

export type LocaleIssue = MissingLocaleStringIssue | MissingResourceLocaleIssue;

/**
 * `LocalisedStringSchema` already rejects an empty `en` or `et` at parse
 * time, so a `Concept` that loaded at all has both locales by construction.
 * This exists as an explicit, reportable pass rather than a silent schema
 * fact, and as a seam for Phase 14 subjects that may compose concepts
 * differently.
 */
export function checkConceptLocales(concepts: Concept[]): MissingLocaleStringIssue[] {
  const issues: MissingLocaleStringIssue[] = [];
  for (const concept of concepts) {
    for (const field of ["title", "summary"] as const) {
      for (const locale of locales) {
        if (!concept[field][locale]?.trim()) {
          issues.push({ type: "missing-locale-string", conceptId: concept.id, field, locale });
        }
      }
    }
  }
  return issues;
}

/** Every concept needs at least one Resource per locale — the EN and ET resource sets are curated separately, so this can't be inferred from one existing. */
export function checkResourceLocales(
  concepts: Concept[],
  resources: Resource[],
): MissingResourceLocaleIssue[] {
  const issues: MissingResourceLocaleIssue[] = [];
  const localesByConcept = new Map<string, Set<string>>();
  for (const resource of resources) {
    if (!localesByConcept.has(resource.conceptId)) {
      localesByConcept.set(resource.conceptId, new Set());
    }
    localesByConcept.get(resource.conceptId)!.add(resource.locale);
  }

  for (const concept of concepts) {
    const have = localesByConcept.get(concept.id) ?? new Set<string>();
    for (const locale of locales) {
      if (!have.has(locale)) {
        issues.push({ type: "missing-resource-locale", conceptId: concept.id, locale });
      }
    }
  }
  return issues;
}
