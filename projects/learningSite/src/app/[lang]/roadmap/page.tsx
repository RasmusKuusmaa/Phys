import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import { levelOrder, type Concept } from "@/schema";
import { RoadmapSections, type LevelGroup } from "./RoadmapSections";

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

  const byLevel = new Map<string, Map<string, Concept[]>>();
  for (const level of levelOrder) byLevel.set(level, new Map());
  for (const concept of concepts) {
    const modules = byLevel.get(concept.level)!;
    if (!modules.has(concept.module)) modules.set(concept.module, []);
    modules.get(concept.module)!.push(concept);
  }

  const groups: LevelGroup[] = levelOrder
    .map((level) => ({
      level,
      modules: [...byLevel.get(level)!.entries()].map(([name, moduleConcepts]) => ({
        name,
        concepts: moduleConcepts,
      })),
    }))
    .filter((group) => group.modules.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.roadmap}</h1>
      <RoadmapSections groups={groups} concepts={concepts} locale={locale} />
    </div>
  );
}
