import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { loadConceptItems } from "@/content/conceptItems";
import type { TestConfig } from "@/schema";
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
  const subject = params.subject ?? "physics";

  // Ad-hoc query parsing for now — item 8 (encode test config and seed in
  // url) replaces this with the shared codec used by the builder too.
  const config: TestConfig = {
    subject,
    levels: (params.levels ?? "").split(",").filter(Boolean) as TestConfig["levels"],
    conceptIds: (params.concepts ?? "").split(",").filter(Boolean),
    itemCount: Math.max(1, Number(params.count) || 5),
    mode: (params.mode as TestConfig["mode"]) ?? "mixed",
    answerFormat: (params.format as TestConfig["answerFormat"]) ?? "multiple-choice",
    seed: params.seed ?? "default",
  };

  if (config.conceptIds.length === 0 || config.levels.length === 0) {
    return <p style={{ padding: "2rem" }}>Missing test configuration.</p>;
  }

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
    />
  );
}
