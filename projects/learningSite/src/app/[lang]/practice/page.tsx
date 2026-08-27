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
    return <p style={{ padding: "2rem" }}>No subjects available yet.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{dict.nav.practice}</h1>
      <TestBuilderForm
        subject={subject}
        concepts={concepts}
        locale={locale}
        initialConceptIds={initialConceptIds}
      />
    </div>
  );
}
