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
  const subject = subjectParam && subjects.includes(subjectParam) ? subjectParam : subjects[0];

  const concepts = subject ? loadConcepts(subject) : [];
  const initialConceptIds = conceptsParam ? conceptsParam.split(",").filter(Boolean) : undefined;

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
