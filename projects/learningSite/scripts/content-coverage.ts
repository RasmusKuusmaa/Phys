import { readdirSync } from "node:fs";
import { CONTENT_ROOT, listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadMisconceptions } from "@/content/misconceptions";
import { loadResources } from "@/content/resources";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { loadConceptItems } from "@/content/conceptItems";
import { MIN_MISCONCEPTIONS_PER_CONCEPT } from "@/content/checks/coverage";
import { waivedConcepts } from "@/content/coverageWaivers";
import { locales } from "@/i18n/locales";

/**
 * A per-concept completeness table — what `validate:content` enforces, laid
 * out so the remaining authoring work is visible at a glance rather than as
 * a wall of individual failures. Always exits 0: this reports, it doesn't gate.
 */

function listExplanationFiles(subject: string): Set<string> {
  try {
    return new Set(readdirSync(`${CONTENT_ROOT}/${subject}/explanations`));
  } catch {
    return new Set();
  }
}

function pad(value: string, width: number): string {
  return value.length >= width ? value : value + " ".repeat(width - value.length);
}

function main() {
  const onlyIncomplete = process.argv.includes("--incomplete");

  for (const subject of listSubjects()) {
    const concepts = loadConcepts(subject);
    const misconceptions = loadMisconceptions(subject);
    const items = loadConceptItems(subject);
    const resources = loadResources(subject);
    const formulas = loadFormulas(subject);
    const templates = loadProblemTemplates(subject);
    const errorModels = loadErrorModels(subject);
    const explanations = listExplanationFiles(subject);
    const waived = waivedConcepts(subject);

    const count = <T,>(records: T[], key: (r: T) => string, id: string) =>
      records.filter((r) => key(r) === id).length;

    const idWidth = Math.max(20, ...concepts.map((c) => c.id.length));
    const header = [
      pad("concept", idWidth),
      "lvl",
      pad("module", 22),
      " f",
      "misc",
      "item",
      ...locales.map((l) => `res:${l}`),
      ...locales.map((l) => `exp:${l}`),
      "",
    ].join("  ");

    const rows: string[] = [];
    let complete = 0;

    for (const concept of [...concepts].sort(
      (a, b) => a.level.localeCompare(b.level) || a.module.localeCompare(b.module) || a.id.localeCompare(b.id),
    )) {
      const conceptFormulas = formulas.filter((f) => f.conceptId === concept.id);
      const formulasFullyBacked = conceptFormulas.every(
        (f) =>
          templates.some((t) => t.formulaId === f.id) &&
          errorModels.some((e) => e.formulaId === f.id),
      );
      const misc = count(misconceptions, (m) => m.conceptId, concept.id);
      const item = count(items, (i) => i.conceptId, concept.id);
      const res = locales.map(
        (l) => resources.filter((r) => r.conceptId === concept.id && r.locale === l).length,
      );
      const exp = locales.map((l) => (explanations.has(`${concept.id}-${l}.mdx`) ? 1 : 0));

      const ok =
        formulasFullyBacked &&
        misc >= MIN_MISCONCEPTIONS_PER_CONCEPT &&
        item >= 1 &&
        res.every((n) => n >= 1) &&
        exp.every((n) => n === 1);
      if (ok) complete++;
      if (ok && onlyIncomplete) continue;

      const mark = ok ? "ok" : waived.has(concept.id) ? "waived" : "INCOMPLETE";
      rows.push(
        [
          pad(concept.id, idWidth),
          concept.level,
          pad(concept.module, 22),
          pad(conceptFormulas.length ? (formulasFullyBacked ? "y" : "!") : "-", 2),
          pad(String(misc), 4),
          pad(String(item), 4),
          ...res.map((n) => pad(String(n), 6)),
          ...exp.map((n) => pad(n ? "y" : "-", 6)),
          mark,
        ].join("  "),
      );
    }

    console.log(`\n== ${subject} ==\n`);
    console.log(header);
    console.log("-".repeat(header.length));
    for (const row of rows) console.log(row);
    console.log(
      `\n${complete}/${concepts.length} concept(s) complete; ${concepts.length - complete} remaining (${waived.size} waived in COVERAGE_WAIVERS).`,
    );
  }
}

main();
