import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { hasDatabase } from "@/db/pool";
import { RegisterForm } from "./RegisterForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.auth.registerHeading} — ${dict.site.name}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/register`])) },
  };
}

export default async function RegisterPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  if (!hasDatabase()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">{dict.auth.registerHeading}</h1>
        <p className="mt-4 text-sm text-muted">{dict.auth.accountsUnavailable}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.auth.registerHeading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.auth.registerIntro}</p>
      <RegisterForm locale={locale} strings={dict.auth} />
    </div>
  );
}
