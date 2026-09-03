import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import { computeUnlocks } from "@/lib/roadmap/reversePrerequisites";
import type { Concept } from "@/schema";
import { ConceptCard } from "@/components/ConceptCard";

export async function generateStaticParams() {
  const params: { subject: string; module: string }[] = [];
  for (const subject of listSubjects()) {
    const seen = new Set<string>();
    for (const concept of loadConcepts(subject)) {
      if (seen.has(concept.module)) continue;
      seen.add(concept.module);
      params.push({ subject, module: concept.module });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; module: string }>;
}): Promise<Metadata> {
  const dict = await getDictionary();
  const { subject, module } = await params;
  return {
    title: `${module.replace(/-/g, " ")} — ${dict.site.name}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/topics/${subject}/${module}`])),
    },
  };
}

export default async function TopicModulePage({
  params,
}: {
  params: Promise<{ subject: string; module: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();

  const { subject, module } = await params;
  if (!listSubjects().includes(subject)) notFound();

  const dict = await getDictionary();
  const allConcepts = loadConcepts(subject);

  // Sorted across the whole subject, not just this module, so a
  // prerequisite that happens to live in a different module still resolves
  // to a real position — then filtered down to this module's own concepts,
  // which keeps their relative order a valid learning path.
  const ordered = topologicalSort(allConcepts).filter((c) => c.module === module);
  if (ordered.length === 0) notFound();

  const conceptById = new Map(allConcepts.map((c) => [c.id, c]));
  const unlocksById = computeUnlocks(allConcepts);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-16">
      <Link href={`/${locale}/topics?subject=${subject}`} className="text-sm text-muted hover:text-foreground">
        ← {dict.topics.backToTopics}
      </Link>
      <h1 className="mt-2 text-3xl font-semibold capitalize">{module.replace(/-/g, " ")}</h1>
      <p className="mt-2 text-sm text-muted">
        {ordered.length} {dict.topics.conceptsSuffix}
      </p>

      <ol className="mt-8 space-y-4">
        {ordered.map((concept, index) => (
          <li key={concept.id} className="flex gap-3">
            <span className="mt-4 w-6 shrink-0 text-right text-xs text-muted" aria-hidden="true">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <ConceptCard
                concept={concept}
                locale={locale}
                prerequisites={concept.prerequisites
                  .map((id) => conceptById.get(id))
                  .filter((c): c is Concept => c !== undefined)}
                unlocks={(unlocksById.get(concept.id) ?? []).filter((c) => c.module === module)}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
