import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { ConceptCard } from "@/components/ConceptCard";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";

export default async function HomePage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const concepts = listSubjects().flatMap((subject) => loadConcepts(subject));
  const startingPoints = topologicalSort(concepts).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-semibold text-balance">{dict.home.heading}</h1>
        <p className="mt-4 text-lg text-muted">{dict.home.subheading}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/roadmap`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {dict.home.ctaRoadmap}
          </Link>
          <Link
            href={`/${locale}/formulas`}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
          >
            {dict.home.ctaFormulas}
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-semibold">{dict.home.featuresHeading}</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {dict.home.features.map((feature) => (
            <div key={feature.title}>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {startingPoints.length > 0 && (
        <section className="mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">{dict.home.startHereHeading}</h2>
            <Link href={`/${locale}/roadmap`} className="text-sm text-muted hover:text-foreground">
              {dict.home.startHereCta}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {startingPoints.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
