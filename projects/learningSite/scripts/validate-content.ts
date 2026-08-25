import { readdirSync } from "node:fs";
import { CONTENT_ROOT, ContentValidationError, listSubjects, loadJsonFilesRaw } from "@/content/loader";
import { loadGlossary, loadBannedVariants } from "@/content/glossary";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadMisconceptions } from "@/content/misconceptions";
import { loadResources } from "@/content/resources";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { loadConceptItems } from "@/content/conceptItems";
import { checkPrerequisites } from "@/content/checks/prerequisites";
import { checkConceptLocales, checkResourceLocales } from "@/content/checks/locales";
import {
  checkConceptCoverage,
  coverageIssueConceptId,
  describeCoverageIssue,
} from "@/content/checks/coverage";
import { waivedConcepts } from "@/content/coverageWaivers";
import { findStaleLocalisedStrings } from "@/content/staleness";
import { locales } from "@/i18n/locales";

function listExplanationFiles(subject: string): string[] {
  try {
    return readdirSync(`${CONTENT_ROOT}/${subject}/explanations`);
  } catch {
    return [];
  }
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    loadGlossary();
    loadBannedVariants();
  } catch (err) {
    if (err instanceof ContentValidationError) errors.push(err.message);
    else throw err;
  }

  const subjects = listSubjects();
  let conceptCount = 0;

  for (const subject of subjects) {
    try {
      const concepts = loadConcepts(subject);
      const formulas = loadFormulas(subject);
      const misconceptions = loadMisconceptions(subject);
      const problemTemplates = loadProblemTemplates(subject);
      const errorModels = loadErrorModels(subject);
      const items = loadConceptItems(subject);
      const resources = loadResources(subject);
      conceptCount += concepts.length;

      for (const issue of checkPrerequisites(concepts)) {
        errors.push(
          issue.type === "unresolved"
            ? `[${subject}] concept "${issue.conceptId}" references unknown prerequisite "${issue.missingPrerequisite}"`
            : `[${subject}] prerequisite cycle: ${issue.cycle.join(" -> ")}`,
        );
      }

      for (const issue of checkConceptLocales(concepts)) {
        errors.push(
          `[${subject}] concept "${issue.conceptId}" is missing ${issue.field}.${issue.locale}`,
        );
      }

      const waived = waivedConcepts(subject);
      const resourceIssues = checkResourceLocales(concepts, resources);
      for (const issue of resourceIssues) {
        const message = `[${subject}] concept "${issue.conceptId}" has no resource for locale "${issue.locale}"`;
        if (waived.has(issue.conceptId)) warnings.push(message);
        else errors.push(message);
      }

      const coverageIssues = checkConceptCoverage({
        concepts,
        misconceptions,
        items,
        formulas,
        problemTemplates,
        errorModels,
        explanationFiles: listExplanationFiles(subject),
        locales,
      });

      // A waiver only silences a concept that actually has gaps; one covering
      // a now-complete concept is an error of its own, so the list can't rot.
      const conceptsWithGaps = new Set(
        [...coverageIssues, ...resourceIssues].map((issue) =>
          "conceptId" in issue ? issue.conceptId : "",
        ),
      );
      for (const conceptId of waived) {
        if (!conceptsWithGaps.has(conceptId)) {
          errors.push(
            `[${subject}] stale coverage waiver for "${conceptId}" — the concept is complete, remove it from COVERAGE_WAIVERS`,
          );
        }
      }

      // Every coverage issue blocks unless its concept is explicitly waived.
      // `missing-explanation` was advisory while the Phase 11b backlog was
      // being cleared; a concept page still degrades gracefully without an
      // explanation, but the content requirement is now enforced.
      for (const issue of coverageIssues) {
        const message = describeCoverageIssue(subject, issue);
        if (waived.has(coverageIssueConceptId(issue))) warnings.push(message);
        else errors.push(message);
      }

      for (const file of loadJsonFilesRaw(`${CONTENT_ROOT}/${subject}`)) {
        for (const stalePath of findStaleLocalisedStrings(file.data)) {
          errors.push(`[${subject}] stale translation at ${file.filePath}#${stalePath}`);
        }
      }
    } catch (err) {
      if (err instanceof ContentValidationError) errors.push(err.message);
      else throw err;
    }
  }

  if (warnings.length) {
    console.warn(`${warnings.length} waived coverage gap(s) — see todo.md:\n`);
    for (const warning of warnings) console.warn(`  ${warning}`);
    console.warn("");
  }

  if (errors.length === 0) {
    console.log(
      `Content validation OK: ${subjects.length} subject(s), ${conceptCount} concept(s).`,
    );
    return;
  }

  console.error(`Content validation failed: ${errors.length} issue(s)\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exitCode = 1;
}

main();
