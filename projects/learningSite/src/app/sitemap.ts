import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { loadAllConcepts } from "@/content/concepts";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Every static, publicly-indexable route, listed once *per locale* — each
 * entry carries hreflang alternates covering every locale including itself,
 * which is what lets a crawler discover both `/en/...` and `/et/...` as
 * distinct indexable pages rather than treating one as a mere alternate of
 * the other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const concepts = loadAllConcepts();

  const staticPaths = [
    "",
    "/roadmap",
    "/curriculum",
    "/formulas",
    "/glossary",
    "/practice",
    "/progress",
  ];
  const conceptPaths = concepts.map((concept) => `/concepts/${concept.id}`);
  const paths = [...staticPaths, ...conceptPaths];

  const languages = (path: string) =>
    Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]));

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: { languages: languages(path) },
    })),
  );
}
