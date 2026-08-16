import { hashSource } from "@/schema/hash";
import type { LocalisedString } from "@/schema";

export function isLocalisedStringShape(value: unknown): value is LocalisedString {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "et" in value &&
    "sourceHash" in value &&
    "stale" in value &&
    typeof (value as Record<string, unknown>).en === "string"
  );
}

/**
 * Recomputes the hash of `en` and flips `stale` to true when it no longer
 * matches the stored `sourceHash` — i.e. English changed since the
 * Estonian translation was last synced. Never clears `stale`: only a human
 * updating the translation and resetting the flag should do that.
 */
function recomputeStaleness(value: LocalisedString): LocalisedString {
  const currentHash = hashSource(value.en);
  if (currentHash === value.sourceHash) return value;
  return { ...value, sourceHash: currentHash, stale: true };
}

/** Walks an arbitrary content JSON tree, recomputing staleness on every LocalisedString found. Used by the hash-computation script (mutates), not by validation (read-only). */
export function walkAndRecomputeStaleness(
  node: unknown,
  onNewlyStale: (path: string) => void,
  pathPrefix = "",
): unknown {
  if (Array.isArray(node)) {
    return node.map((item, i) =>
      walkAndRecomputeStaleness(item, onNewlyStale, `${pathPrefix}[${i}]`),
    );
  }
  if (node && typeof node === "object") {
    if (isLocalisedStringShape(node)) {
      const updated = recomputeStaleness(node);
      if (updated.stale && !node.stale) onNewlyStale(pathPrefix);
      return updated;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = walkAndRecomputeStaleness(
        value,
        onNewlyStale,
        pathPrefix ? `${pathPrefix}.${key}` : key,
      );
    }
    return result;
  }
  return node;
}

/** Read-only: returns the path of every LocalisedString whose stored `stale` flag is true. */
export function findStaleLocalisedStrings(node: unknown, pathPrefix = ""): string[] {
  const found: string[] = [];
  if (Array.isArray(node)) {
    node.forEach((item, i) =>
      found.push(...findStaleLocalisedStrings(item, `${pathPrefix}[${i}]`)),
    );
    return found;
  }
  if (node && typeof node === "object") {
    if (isLocalisedStringShape(node)) {
      if (node.stale) found.push(pathPrefix);
      return found;
    }
    for (const [key, value] of Object.entries(node)) {
      found.push(
        ...findStaleLocalisedStrings(value, pathPrefix ? `${pathPrefix}.${key}` : key),
      );
    }
  }
  return found;
}
