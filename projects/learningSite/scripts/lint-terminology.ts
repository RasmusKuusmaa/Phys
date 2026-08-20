import path from "node:path";
import { CONTENT_ROOT, listSubjects, loadJsonFilesRaw } from "@/content/loader";
import { loadGlossary, loadBannedVariants } from "@/content/glossary";
import { lintBannedVariants, lintUntranslatedTerms } from "@/content/checks/terminology";

function main() {
  const glossary = loadGlossary();
  const bannedVariants = loadBannedVariants();
  const subjects = listSubjects();

  const allFiles = subjects.flatMap((subject) =>
    loadJsonFilesRaw(path.join(CONTENT_ROOT, subject)),
  );
  const issues = [
    ...lintBannedVariants(allFiles, bannedVariants),
    ...lintUntranslatedTerms(allFiles, glossary),
  ];

  if (issues.length === 0) {
    console.log(
      `Terminology lint OK: ${glossary.length} glossary terms, ${bannedVariants.length} banned variants, ${allFiles.length} content files scanned.`,
    );
    return;
  }

  console.error(`Terminology lint failed: ${issues.length} issue(s)\n`);
  for (const issue of issues) {
    if (issue.type === "banned-variant") {
      console.error(
        `  [banned-variant] ${issue.path}: found "${issue.wrong}" — use the glossary term for "${issue.correct}" instead. ${issue.note}`,
      );
    } else {
      console.error(
        `  [untranslated-term] ${issue.path}: "${issue.term}" has no glossary entry`,
      );
    }
  }
  process.exitCode = 1;
}

main();
