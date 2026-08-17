import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { loadConceptItems } from "@/content/conceptItems";
import { loadMisconceptions } from "@/content/misconceptions";
import { decodeTestConfig } from "@/lib/test/testConfigUrl";
import { TestRunner } from "./TestRunner";

export default async function PracticeRunPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const params = await searchParams;
  const config = decodeTestConfig(params);

  if (!config) {
    return <p style={{ padding: "2rem" }}>Missing or invalid test configuration.</p>;
  }
  const subject = config.subject;

  return (
    <TestRunner
      locale={locale}
      dict={dict}
      config={config}
      concepts={loadConcepts(subject)}
      formulas={loadFormulas(subject)}
      templates={loadProblemTemplates(subject)}
      errorModels={loadErrorModels(subject)}
      conceptItems={loadConceptItems(subject)}
      misconceptions={loadMisconceptions(subject)}
    />
  );
}
