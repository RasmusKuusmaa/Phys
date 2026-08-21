import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { levelOrder, type Concept, type Formula } from "@/schema";
import { LevelBadge } from "@/components/LevelBadge";
import { Math } from "@/components/Math";

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
  const rows = loadFormulas(subject)
    .map((formula) => ({ formula, concept: conceptById.get(formula.conceptId) }))
    .filter((row): row is { formula: Formula; concept: Concept } => row.concept !== undefined)
    .sort((a, b) => {
      const levelDiff = levelOrder.indexOf(a.concept.level) - levelOrder.indexOf(b.concept.level);
      return levelDiff !== 0 ? levelDiff : a.concept.title[locale].localeCompare(b.concept.title[locale]);
    });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.formulas}</h1>
      <ul className="mt-8 divide-y divide-border">
        {rows.map(({ formula, concept }) => (
          <li key={formula.id} className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <LevelBadge level={concept.level} />
              <Link href={`/${locale}/concepts/${concept.id}`} className="underline">
                {concept.title[locale]}
              </Link>
            </div>
            <Math tex={formula.latex} />
          </li>
        ))}
      </ul>
    </div>
  );
}
