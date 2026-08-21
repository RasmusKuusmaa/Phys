import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { Math } from "@/components/Math";
import { ConceptCard } from "@/components/ConceptCard";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";

export default async function HomePage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();
  const concepts = listSubjects().flatMap((subject) => loadConcepts(subject));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.home.heading}</h1>
      <p className="mt-4 text-lg text-muted">{dict.home.subheading}</p>
      <p className="mt-8">
        <Math tex="F = ma" display />
      </p>

      {concepts.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {concepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
