import { readdirSync } from "node:fs";
import { CONTENT_ROOT, loadJsonFilesRaw } from "@/content/loader";
import { findStaleLocalisedStrings } from "@/content/staleness";

function subjectDirs(): string[] {
  return readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "terminology")
    .map((e) => e.name);
}

function main() {
  const errors: string[] = [];
  const subjects = subjectDirs();

  for (const subject of subjects) {
    for (const file of loadJsonFilesRaw(`${CONTENT_ROOT}/${subject}`)) {
      for (const stalePath of findStaleLocalisedStrings(file.data)) {
        errors.push(`[${subject}] stale translation at ${file.filePath}#${stalePath}`);
      }
    }
  }

  if (errors.length === 0) {
    console.log(`Content validation OK: ${subjects.length} subject(s), no stale translations.`);
    return;
  }

  console.error(`Content validation failed: ${errors.length} issue(s)\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exitCode = 1;
}

main();
