import Link from "next/link";
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
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <p className="text-sm text-muted">{dict.practice.invalidConfig}</p>
        <Link
          href={`/${locale}/practice`}
          className="mt-4 inline-block rounded-lg border border-border px-4 py-2 text-sm hover:border-accent"
        >
          {dict.practice.backToBuilder}
        </Link>
      </div>
    );
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
