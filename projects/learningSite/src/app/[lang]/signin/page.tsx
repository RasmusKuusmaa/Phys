import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { enabledProviders } from "@/auth";
import { hasDatabase } from "@/db/pool";
import { SignInForm } from "./SignInForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.auth.signInHeading} — ${dict.site.name}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/signin`])) },
  };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();
  const { sent } = await searchParams;

  // The site is fully usable with no database; say so plainly rather than
  // showing a sign-in form that cannot work.
  if (!hasDatabase()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">{dict.auth.signInHeading}</h1>
        <p className="mt-4 text-sm text-muted">{dict.auth.accountsUnavailable}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.auth.signInHeading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.auth.signInIntro}</p>
      <SignInForm
        locale={locale}
        strings={dict.auth}
        providers={enabledProviders()}
        magicLinkAlreadySent={sent === "1"}
      />
    </div>
  );
}
