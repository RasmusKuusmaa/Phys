import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { ProgressManager } from "./ProgressManager";

export default async function ProgressPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.progress}</h1>
      <p className="mt-2 text-sm text-muted">
        No accounts, no backend — this is stored only in this browser.
      </p>
      <ProgressManager />
    </div>
  );
}
