import { ProgressSchema, type Progress } from "./schema";

/** Progress data is ASCII-only (kebab-case ids, enum literals, numbers), so plain btoa/atob is safe — no need for a unicode-safe encoding step. */
export function encodeProgressCode(progress: Progress): string {
  return btoa(JSON.stringify(progress));
}

/** Returns `null` on anything malformed rather than throwing, same convention as decodeTestConfig. */
export function decodeProgressCode(code: string): Progress | null {
  try {
    const parsed = ProgressSchema.safeParse(JSON.parse(atob(code.trim())));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
