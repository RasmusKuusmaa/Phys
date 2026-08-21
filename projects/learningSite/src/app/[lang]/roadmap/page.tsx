import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import { ConceptCard } from "@/components/ConceptCard";
import { levelOrder, type Concept } from "@/schema";

export default async function RoadmapPage({
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

  const concepts = topologicalSort(loadConcepts(subject));
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const byLevel = new Map<string, Map<string, Concept[]>>();
  for (const level of levelOrder) byLevel.set(level, new Map());
  for (const concept of concepts) {
    const modules = byLevel.get(concept.level)!;
    if (!modules.has(concept.module)) modules.set(concept.module, []);
    modules.get(concept.module)!.push(concept);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.roadmap}</h1>

      {levelOrder.map((level) => {
        const modules = byLevel.get(level)!;
        if (modules.size === 0) return null;
        return (
          <section key={level} className="mt-10">
            <h2 className="text-2xl font-semibold">{level}</h2>
            {[...modules.entries()].map(([moduleName, moduleConcepts]) => (
              <div key={moduleName} className="mt-6">
                <h3 className="text-lg font-semibold capitalize">{moduleName}</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {moduleConcepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      locale={locale}
                      prerequisites={concept.prerequisites
                        .map((id) => conceptById.get(id))
                        .filter((c): c is Concept => c !== undefined)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
