import { CONTENT_ROOT, ContentValidationError, listSubjects, loadJsonFilesRaw } from "@/content/loader";
import { loadGlossary, loadBannedVariants } from "@/content/glossary";
import { loadConcepts } from "@/content/concepts";
import { loadFormulas } from "@/content/formulas";
import { loadMisconceptions } from "@/content/misconceptions";
import { loadResources } from "@/content/resources";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { checkPrerequisites } from "@/content/checks/prerequisites";
import { checkConceptLocales, checkResourceLocales } from "@/content/checks/locales";
import { findStaleLocalisedStrings } from "@/content/staleness";

function main() {
  const errors: string[] = [];

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
      // Loading validates the schema even though this pass has no further
      // checks specific to formulas/misconceptions yet.
      loadFormulas(subject);
      loadMisconceptions(subject);
      loadProblemTemplates(subject);
      loadErrorModels(subject);
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

      for (const issue of checkResourceLocales(concepts, resources)) {
        errors.push(
          `[${subject}] concept "${issue.conceptId}" has no resource for locale "${issue.locale}"`,
        );
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
