import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { SyncNotice } from "@/components/auth/SyncNotice";
import { ProgressManager } from "./ProgressManager";

export default async function ProgressPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.progress}</h1>
      <SyncNotice strings={dict.auth} />
      <ProgressManager />
    </div>
  );
}
