import { readdirSync, readFileSync, writeFileSync, type Dirent } from "node:fs";
import { CONTENT_ROOT } from "@/content/loader";
import { walkAndRecomputeStaleness } from "@/content/staleness";

function subjectDirs(): string[] {
  return readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "terminology")
    .map((e) => e.name);
}

function findJsonFiles(dir: string): string[] {
  let entries: Dirent<string>[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) files.push(...findJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
  return files;
}

function main() {
  const files = subjectDirs().flatMap((subject) =>
    findJsonFiles(`${CONTENT_ROOT}/${subject}`),
  );

  let newlyStaleCount = 0;
  let changedFileCount = 0;

  for (const filePath of files) {
    const original = readFileSync(filePath, "utf8");
    const json = JSON.parse(original);
    const newlyStale: string[] = [];
    const updated = walkAndRecomputeStaleness(json, (p) => newlyStale.push(p));

    const serialized = `${JSON.stringify(updated, null, 2)}\n`;
    if (serialized !== original) {
      writeFileSync(filePath, serialized, "utf8");
      changedFileCount++;
    }
    for (const p of newlyStale) {
      console.log(`stale: ${filePath}#${p} (English text changed, Estonian needs review)`);
      newlyStaleCount++;
    }
  }

  console.log(
    `\nChecked ${files.length} file(s), updated ${changedFileCount}, flagged ${newlyStaleCount} newly-stale translation(s).`,
  );
}

main();
