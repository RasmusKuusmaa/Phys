import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { hasDatabase } from "@/db/pool";
import { AccountPanel } from "./AccountPanel";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.auth.account} — ${dict.site.name}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/account`])) },
  };
}

export default async function AccountPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.auth.account}</h1>
      {hasDatabase() ? (
        <AccountPanel locale={locale} strings={dict.auth} />
      ) : (
        <p className="mt-4 text-sm text-muted">{dict.auth.accountsUnavailable}</p>
      )}
    </div>
  );
}
