import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadGlossary } from "@/content/glossary";
import { Math } from "@/components/Math";
import { GlobalSearchList, type SearchRow } from "./GlobalSearchList";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.search.heading} — ${dict.site.name}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/search`])),
    },
  };
}

/**
 * A single search index built per locale, from that locale's text only — a
 * result found while searching `/et/search` never surfaces English-only
 * matches, matching the "index both locales independently" requirement.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const subjects = listSubjects();
  const concepts = subjects.flatMap((subject) => loadConcepts(subject));
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const conceptRows: SearchRow[] = concepts.map((concept) => ({
    id: `concept-${concept.id}`,
    type: "concept",
    title: concept.title[locale],
    subtitle: concept.summary[locale],
    href: `/${locale}/concepts/${concept.id}`,
    searchText: `${concept.title[locale]} ${concept.summary[locale]}`,
  }));

  const formulaRows: SearchRow[] = subjects
    .flatMap((subject) => loadFormulas(subject))
    .map((formula): SearchRow | null => {
      const concept = conceptById.get(formula.conceptId);
      if (!concept) return null;
      const symbolNames = formula.symbols.map((s) => `${s.symbol} ${s.name[locale]}`).join(" ");
      return {
        id: `formula-${formula.id}`,
        type: "formula",
        title: concept.title[locale],
        subtitle: <Math tex={formula.latex} />,
        href: `/${locale}/concepts/${concept.id}`,
        searchText: `${concept.title[locale]} ${symbolNames}`,
      };
    })
    .filter((row): row is SearchRow => row !== null);

  const glossaryRows: SearchRow[] = loadGlossary().map((entry) => ({
    id: `glossary-${entry.id}`,
    type: "glossary",
    title: locale === "et" ? entry.et : entry.en,
    href: `/${locale}/glossary`,
    searchText: locale === "et" ? entry.et : entry.en,
  }));

  const rows = [...conceptRows, ...formulaRows, ...glossaryRows];
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.search.heading}</h1>
      <GlobalSearchList
        rows={rows}
        initialQuery={q ?? ""}
        placeholder={dict.search.placeholder}
        noResultsLabel={dict.search.noResults}
        typeLabels={{
          concept: dict.search.typeConcept,
          formula: dict.search.typeFormula,
          glossary: dict.search.typeGlossary,
        }}
      />
    </div>
  );
}
