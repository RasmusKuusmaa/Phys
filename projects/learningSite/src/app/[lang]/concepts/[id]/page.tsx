import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import type { Concept } from "@/schema";
import { loadAllConcepts, loadConcepts } from "@/content/concepts";
import { loadExplanation } from "@/content/explanations";
import { loadFormulas } from "@/content/formulas";
import { loadMisconceptions } from "@/content/misconceptions";
import { loadResources } from "@/content/resources";
import { computeUnlocks } from "@/lib/roadmap/reversePrerequisites";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import { groupResourcesByType, RESOURCE_TYPE_LABELS } from "@/lib/resources/groupResources";
import { loadCourses, coursesForConcept } from "@/curriculum/loader";
import { LevelBadge } from "@/components/LevelBadge";
import { FormulaDisplay } from "@/components/FormulaDisplay";
import { ConceptLinkList } from "@/components/ConceptCard";
import { ConceptStatusControl } from "@/components/ConceptStatusControl";
import { StudyStats } from "./StudyStats";

export async function generateStaticParams() {
  return loadAllConcepts().map((concept) => ({ id: concept.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const locale = await lang();
  if (!locale || !isLocale(locale)) return {};

  const { id } = await params;
  const concept = loadAllConcepts().find((c) => c.id === id);
  if (!concept) return {};

  return {
    title: concept.title[locale],
    description: concept.summary[locale],
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/concepts/${id}`])),
    },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const { id } = await params;
  const concepts = loadAllConcepts();
  const concept = concepts.find((c) => c.id === id);
  if (!concept) notFound();

  const courses = coursesForConcept(concept.id, loadCourses());

  const conceptById = new Map(concepts.map((c) => [c.id, c]));
  const prerequisites = concept.prerequisites
    .map((prereqId) => conceptById.get(prereqId))
    .filter((c): c is Concept => c !== undefined);
  const unlocks = computeUnlocks(concepts).get(concept.id) ?? [];

  const formulas = loadFormulas(concept.subject).filter((f) => f.conceptId === concept.id);
  const misconceptions = loadMisconceptions(concept.subject).filter(
    (m) => m.conceptId === concept.id,
  );
  const resources = loadResources(concept.subject).filter((r) => r.conceptId === concept.id);
  const resourceGroups = groupResourcesByType(resources, locale);
  const Explanation = await loadExplanation(concept.subject, concept.id, locale);

  const studyOrder = topologicalSort(loadConcepts(concept.subject));
  const studyIndex = studyOrder.findIndex((c) => c.id === concept.id);
  const previousInStudyOrder = studyIndex > 0 ? studyOrder[studyIndex - 1] : undefined;
  const nextInStudyOrder =
    studyIndex >= 0 && studyIndex < studyOrder.length - 1 ? studyOrder[studyIndex + 1] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: concept.title[locale],
    description: concept.summary[locale],
    inLanguage: locale,
    educationalLevel: concept.level,
    url: `/${locale}/concepts/${concept.id}`,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        // JSON-LD from authored content (title/summary), not user input — still
        // scrub `<` per Next's guidance so a stray "<script>" in copy can't break out.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex items-center gap-2">
        <LevelBadge level={concept.level} />
        <h1 className="text-3xl font-semibold">{concept.title[locale]}</h1>
      </div>
      <p className="mt-4 text-muted">{concept.summary[locale]}</p>

      <Link
        href={`/${locale}/practice?concepts=${concept.id}`}
        className="mt-6 inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
      >
        Practise this concept
      </Link>

      <ConceptStatusControl conceptId={concept.id} />

      <StudyStats conceptId={concept.id} locale={locale} strings={dict.journal} />

      {Explanation && (
        <section className="mt-10 space-y-4 text-sm leading-relaxed">
          <Explanation />
        </section>
      )}

      {(prerequisites.length > 0 || unlocks.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Key ideas</h2>
          <ConceptLinkList label="Requires" concepts={prerequisites} locale={locale} />
          <ConceptLinkList label="Unlocks" concepts={unlocks} locale={locale} />
        </section>
      )}

      {formulas.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Formulas</h2>
          <div className="mt-3 space-y-8">
            {formulas.map((formula) => (
              <FormulaDisplay key={formula.id} formula={formula} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {misconceptions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Common misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {misconceptions.map((misconception) => (
              <li key={misconception.id}>{misconception.text[locale]}</li>
            ))}
          </ul>
        </section>
      )}

      {resourceGroups.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Resources</h2>
          <div className="mt-3 space-y-6">
            {resourceGroups.map((group) => (
              <div key={group.type}>
                <h3 className="text-sm font-semibold text-muted">
                  {RESOURCE_TYPE_LABELS[group.type]}
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {group.resources.map((resource) => (
                    <li key={resource.id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted hover:decoration-solid"
                      >
                        {resource.title}
                      </a>
                      <span className="ml-2 text-xs text-muted uppercase">{resource.locale}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{dict.curriculum.conceptMembershipHeading}</h2>
          <p className="mt-2 text-sm text-muted">{dict.curriculum.conceptMembershipNote}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {courses.map((course) => {
              const track =
                (Object.entries(course.status).find(([, s]) => s !== "not-in-track")?.[0] as
                  | keyof typeof course.status
                  | undefined) ?? "physics";
              return (
                <li key={course.code}>
                  <Link
                    href={`/${locale}/curriculum?track=${track}#${course.code}`}
                    className="underline"
                  >
                    {course.name[locale]}
                  </Link>
                  <span className="ml-2 text-xs text-muted">{course.code}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(previousInStudyOrder || nextInStudyOrder) && (
        <nav
          aria-label="Study order"
          className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm"
        >
          {previousInStudyOrder ? (
            <Link href={`/${locale}/concepts/${previousInStudyOrder.id}`} className="underline">
              ← {previousInStudyOrder.title[locale]}
            </Link>
          ) : (
            <span />
          )}
          {nextInStudyOrder ? (
            <Link href={`/${locale}/concepts/${nextInStudyOrder.id}`} className="underline">
              {nextInStudyOrder.title[locale]} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
