import type { Metadata } from "next";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { buildNoteTargets } from "@/lib/notes/targets";
import { SyncNotice } from "@/components/auth/SyncNotice";
import { NotesManager } from "./NotesManager";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: `${dict.notes.heading} — ${dict.site.name}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/notes`])),
    },
  };
}

export default async function NotesPage() {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  return (
    // Wider than the reading pages: this one is a two-pane list/detail
    // layout, not a column of prose.
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.notes.heading}</h1>
      <SyncNotice strings={dict.auth} />
      <NotesManager
        locale={locale}
        strings={dict.notes}
        typeLabels={{
          concept: dict.search.typeConcept,
          formula: dict.search.typeFormula,
          glossary: dict.search.typeGlossary,
        }}
        targets={buildNoteTargets(locale)}
      />
    </div>
  );
}
