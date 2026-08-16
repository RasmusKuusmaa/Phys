import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadBannedVariants } from "@/content/glossary";
import { lintBannedVariants } from "@/content/checks/terminology";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function subjectDirs(): string[] {
  return readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "terminology")
    .map((e) => e.name);
}

function findJsonFiles(dir: string): string[] {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
  return files;
}

function loadJsonFilesRaw(dir: string) {
  return findJsonFiles(dir).map((filePath) => ({
    filePath,
    data: JSON.parse(readFileSync(filePath, "utf8")),
  }));
}

function main() {
  const bannedVariants = loadBannedVariants();
  const subjects = subjectDirs();

  const allFiles = subjects.flatMap((subject) =>
    loadJsonFilesRaw(path.join(CONTENT_ROOT, subject)),
  );
  const issues = lintBannedVariants(allFiles, bannedVariants);

  if (issues.length === 0) {
    console.log(
      `Terminology lint OK: ${bannedVariants.length} banned variants, ${allFiles.length} content files scanned.`,
    );
    return;
  }

  console.error(`Terminology lint failed: ${issues.length} issue(s)\n`);
  for (const issue of issues) {
    console.error(
      `  [banned-variant] ${issue.path}: found "${issue.wrong}" — use the glossary term for "${issue.correct}" instead. ${issue.note}`,
    );
  }
  process.exitCode = 1;
}

main();
