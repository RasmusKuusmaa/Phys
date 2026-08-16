import { createHash } from "node:crypto";

/**
 * Hashes the English source text of a LocalisedString. Compared against
 * the stored `sourceHash` at build time to detect when English changed
 * without the Estonian translation being revisited.
 */
export function hashSource(sourceText: string): string {
  return createHash("sha256").update(sourceText, "utf8").digest("hex").slice(0, 16);
}
