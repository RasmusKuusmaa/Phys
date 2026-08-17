import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadConcepts } from "@/content/concepts";
import { TestBuilderForm } from "./TestBuilderForm";

export default async function PracticePage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();
  // Only "physics" exists as a subject so far — Phase 14 adds more.
  const concepts = loadConcepts("physics");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{dict.nav.practice}</h1>
      <TestBuilderForm subject="physics" concepts={concepts} locale={locale} />
    </div>
  );
}
