import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadAllConcepts } from "@/content/concepts";
import { JournalEntryForm } from "./JournalEntryForm";
import { TodaySessions } from "./TodaySessions";
import { JournalTimeline } from "./JournalTimeline";
import { ReflectionEditor } from "./ReflectionEditor";
import { StreakCalendar } from "./StreakCalendar";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.journal.heading} — ${dict.site.name}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/journal`])),
    },
  };
}

export default async function JournalPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  // Every subject's concepts, not just one — a study session can be about
  // any topic on the site, and the topic picker's own search field is what
  // keeps that list usable (same reasoning as the global search page).
  const concepts = loadAllConcepts();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.journal.heading}</h1>
      <p className="mt-2 text-sm text-muted">{dict.journal.intro}</p>
      <div className="mt-6">
        <StreakCalendar locale={locale} strings={dict.journal} />
      </div>
      <div className="mt-8">
        <JournalEntryForm concepts={concepts} locale={locale} strings={dict.journal} />
      </div>
      <TodaySessions concepts={concepts} locale={locale} strings={dict.journal} />
      <ReflectionEditor strings={dict.journal} />
      <JournalTimeline concepts={concepts} locale={locale} strings={dict.journal} />
    </div>
  );
}
