import type { Locale } from "@/i18n/locales";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadGlossary } from "@/content/glossary";
import type { NoteTarget } from "./schema";

/**
 * Every concept, formula and glossary term a note can be linked to, in the
 * given locale. Server-only — it reads content off disk — so pages build
 * this and pass the result to the client components that need it.
 *
 * Labels only: no summaries or LaTeX bodies, which keeps this well under
 * what the global search page already ships to the browser.
 */
export function buildNoteTargets(locale: Locale): NoteTarget[] {
  const subjects = listSubjects();
  const concepts = subjects.flatMap((subject) => loadConcepts(subject));
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const conceptTargets: NoteTarget[] = concepts.map((concept) => ({
    kind: "concept",
    id: concept.id,
    label: concept.title[locale],
    href: `/${locale}/concepts/${concept.id}`,
  }));

  const formulaTargets: NoteTarget[] = subjects
    .flatMap((subject) => loadFormulas(subject))
    .map((formula): NoteTarget | null => {
      const concept = conceptById.get(formula.conceptId);
      if (!concept) return null;
      return {
        kind: "formula",
        id: formula.id,
        // A formula has no name of its own — it's identified by the
        // concept it belongs to plus the symbols it relates.
        label: `${concept.title[locale]} · ${formula.symbols.map((s) => s.symbol).join(", ")}`,
        href: `/${locale}/concepts/${concept.id}`,
      };
    })
    .filter((t): t is NoteTarget => t !== null);

  const glossaryTargets: NoteTarget[] = loadGlossary().map((entry) => ({
    kind: "glossary",
    id: entry.id,
    label: locale === "et" ? entry.et : entry.en,
    href: `/${locale}/glossary`,
  }));

  return [...conceptTargets, ...formulaTargets, ...glossaryTargets];
}
