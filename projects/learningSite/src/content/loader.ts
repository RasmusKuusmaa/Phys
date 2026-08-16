import { readdirSync, readFileSync, type Dirent } from "node:fs";
import path from "node:path";
import type { z } from "zod";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

export type LoadIssue = {
  filePath: string;
  message: string;
};

export class ContentValidationError extends Error {
  issues: LoadIssue[];

  constructor(issues: LoadIssue[]) {
    super(
      `Content validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):\n` +
        issues.map((i) => `  ${i.filePath}: ${i.message}`).join("\n"),
    );
    this.issues = issues;
  }
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
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
  return files.sort();
}

/** One JSON object per file — the file's basename (minus extension) is not assumed to equal `id`; callers cross-check that separately if needed. */
export function loadContentDir<T>(
  dir: string,
  schema: z.ZodType<T>,
): { filePath: string; value: T }[] {
  const files = findJsonFiles(dir);
  const results: { filePath: string; value: T }[] = [];
  const issues: LoadIssue[] = [];

  for (const filePath of files) {
    const raw = readFileSync(filePath, "utf8");
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      issues.push({ filePath, message: `invalid JSON: ${(err as Error).message}` });
      continue;
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({ filePath, message: `${issue.path.join(".") || "(root)"}: ${issue.message}` });
      }
      continue;
    }
    results.push({ filePath, value: parsed.data });
  }

  if (issues.length) throw new ContentValidationError(issues);
  return results;
}

/** Raw JSON, unvalidated — for scans (e.g. the terminology linters) that shouldn't be blocked by an unrelated schema error elsewhere in the tree. */
export function loadJsonFilesRaw(dir: string): { filePath: string; data: unknown }[] {
  return findJsonFiles(dir).map((filePath) => ({
    filePath,
    data: JSON.parse(readFileSync(filePath, "utf8")),
  }));
}

/** A single JSON file, validated as a whole (e.g. the glossary — pass a `z.array(...)` schema). */
export function loadJsonArrayFile<T>(filePath: string, schema: z.ZodType<T>): T {
  const raw = readFileSync(filePath, "utf8");
  const json = JSON.parse(raw);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ContentValidationError(
      parsed.error.issues.map((issue) => ({
        filePath,
        message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
      })),
    );
  }
  return parsed.data;
}
