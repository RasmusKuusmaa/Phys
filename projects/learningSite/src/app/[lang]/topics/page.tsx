import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { levelOrder, type Concept } from "@/schema";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.topics.heading} — ${dict.site.name}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/topics`])) },
  };
}

/** One row per module: how many concepts it has and the level span they cover, e.g. "6 concepts · L1-L4". */
function summarizeModules(concepts: Concept[]) {
  const byModule = new Map<string, Concept[]>();
  for (const concept of concepts) {
    const list = byModule.get(concept.module) ?? [];
    list.push(concept);
    byModule.set(concept.module, list);
  }
  return [...byModule.entries()]
    .map(([name, moduleConcepts]) => {
      const indices = moduleConcepts.map((c) => levelOrder.indexOf(c.level));
      const minLevel = levelOrder[Math.min(...indices)]!;
      const maxLevel = levelOrder[Math.max(...indices)]!;
      return { name, count: moduleConcepts.length, minLevel, maxLevel };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default async function TopicsPage({
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
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-3xl font-semibold">{dict.topics.heading}</h1>
        <p className="mt-4 text-sm text-muted">{dict.topics.noSubjects}</p>
      </div>
    );
  }

  const modules = summarizeModules(loadConcepts(subject));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-16">
      <h1 className="text-3xl font-semibold">{dict.topics.heading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.topics.intro}</p>

      {subjects.length > 1 && (
        <nav aria-label={dict.topics.subjectLabel} className="mt-6 flex flex-wrap gap-2">
          {subjects.map((option) => (
            <Link
              key={option}
              href={`/${locale}/topics?subject=${option}`}
              aria-current={option === subject ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm capitalize transition-colors ${
                option === subject
                  ? "border border-accent bg-accent/10 font-medium"
                  : "border border-border text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              {option}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <Link
            key={module.name}
            href={`/${locale}/topics/${subject}/${module.name}`}
            className="rounded-lg border border-border p-4 hover:border-accent"
          >
            <h2 className="font-semibold capitalize">{module.name.replace(/-/g, " ")}</h2>
            <p className="mt-1 text-sm text-muted">
              {module.count} {dict.topics.conceptsSuffix} ·{" "}
              {module.minLevel === module.maxLevel
                ? module.minLevel
                : `${module.minLevel}–${module.maxLevel}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
