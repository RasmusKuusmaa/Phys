import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadElements } from "@/content/elements";
import { PeriodicTable } from "./PeriodicTable";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.periodicTable.heading} — ${dict.site.name}`,
    description: dict.periodicTable.intro,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/periodic-table`])),
    },
  };
}

export default async function PeriodicTablePage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.periodicTable.heading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.periodicTable.intro}</p>
      <PeriodicTable
        elements={loadElements()}
        locale={locale}
        strings={dict.periodicTable}
      />
    </div>
  );
}
