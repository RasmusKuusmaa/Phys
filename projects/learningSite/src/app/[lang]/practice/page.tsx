import Link from "next/link";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { TestBuilderForm } from "./TestBuilderForm";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; concepts?: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const subjects = listSubjects();
  const { subject: subjectParam, concepts: conceptsParam } = await searchParams;
  const requestedConceptIds = conceptsParam ? conceptsParam.split(",").filter(Boolean) : undefined;

  // A "practise this concept" link only ever carries `concepts`, never
  // `subject` — so when a subject isn't given explicitly, find the subject
  // that actually owns the requested concept rather than silently falling
  // back to the alphabetically-first one (`chemistry`), which left every
  // non-chemistry launcher landing on the wrong subject's concept list.
  const subjectOwningConcept = requestedConceptIds?.length
    ? subjects.find((s) => {
        const ids = loadConcepts(s).map((c) => c.id);
        return requestedConceptIds.some((id) => ids.includes(id));
      })
    : undefined;

  const subject =
    (subjectParam && subjects.includes(subjectParam) ? subjectParam : undefined) ??
    subjectOwningConcept ??
    subjects[0];

  const concepts = subject ? loadConcepts(subject) : [];
  const conceptIdSet = new Set(concepts.map((c) => c.id));
  const initialConceptIds = requestedConceptIds?.filter((id) => conceptIdSet.has(id));

  if (!subject) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted">{dict.practice.noSubjects}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.practice.heading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.practice.intro}</p>

      {subjects.length > 1 && (
        <nav aria-label={dict.practice.subjectLabel} className="mt-6 flex flex-wrap gap-2">
          {subjects.map((option) => (
            <Link
              key={option}
              href={`/${locale}/practice?subject=${option}`}
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

      <TestBuilderForm
        // Remounts on a subject switch so the concept selection resets to
        // the new subject's concepts rather than carrying over ids that
        // don't exist in it.
        key={subject}
        subject={subject}
        concepts={concepts}
        locale={locale}
        strings={dict.practice}
        initialConceptIds={initialConceptIds}
      />
    </div>
  );
}
