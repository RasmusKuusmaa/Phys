import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { levelOrder, type Concept, type Formula } from "@/schema";
import { FormulaSearchList, type FormulaRow } from "./FormulaSearchList";

export default async function FormulaIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const subjects = listSubjects();
  const { subject: subjectParam } = await searchParams;
  const subject = subjectParam && subjects.includes(subjectParam) ? subjectParam : subjects[0];

  if (!subject) {
    return <p style={{ padding: "2rem" }}>No subjects available yet.</p>;
  }

  const conceptById = new Map(loadConcepts(subject).map((c) => [c.id, c]));
  const rows: FormulaRow[] = loadFormulas(subject)
    .map((formula) => ({ formula, concept: conceptById.get(formula.conceptId) }))
    .filter((row): row is { formula: Formula; concept: Concept } => row.concept !== undefined)
    .sort((a, b) => {
      const levelDiff = levelOrder.indexOf(a.concept.level) - levelOrder.indexOf(b.concept.level);
      return levelDiff !== 0 ? levelDiff : a.concept.title[locale].localeCompare(b.concept.title[locale]);
    })
    .map(({ formula, concept }) => ({
      formula,
      concept,
      searchText: [
        concept.title[locale],
        ...formula.symbols.map((s) => `${s.symbol} ${s.name[locale]}`),
      ].join(" "),
    }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.formulas}</h1>
      <FormulaSearchList rows={rows} locale={locale} />
    </div>
  );
}
