import { readdirSync } from "node:fs";
import { CONTENT_ROOT, loadJsonFilesRaw } from "@/content/loader";
import { findStaleLocalisedStrings } from "@/content/staleness";

function subjectDirs(): string[] {
  return readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "terminology")
    .map((e) => e.name);
}

/** Non-failing report of every translation currently flagged stale, for human review — `validate-content` is what fails the build. */
function main() {
  const subjects = subjectDirs();
  let total = 0;

  for (const subject of subjects) {
    const files = loadJsonFilesRaw(`${CONTENT_ROOT}/${subject}`);
    for (const file of files) {
      for (const stalePath of findStaleLocalisedStrings(file.data)) {
        console.log(`[${subject}] ${file.filePath}#${stalePath}`);
        total++;
      }
    }
  }

  console.log(`\n${total} stale translation(s) across ${subjects.length} subject(s).`);
}

main();
