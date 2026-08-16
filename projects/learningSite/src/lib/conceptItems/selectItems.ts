import type { ConceptItem } from "@/schema";
import { createRng, hashSeed, shuffle } from "@/lib/formula/rng";

/** Samples up to `count` items across the chosen concepts, each item appearing at most once, deterministically for a given seed. */
export function selectItems(
  items: ConceptItem[],
  conceptIds: string[],
  count: number,
  seed: string,
): ConceptItem[] {
  const pool = items.filter((item) => conceptIds.includes(item.conceptId));
  const rng = createRng(hashSeed(seed));
  const shuffled = shuffle(pool, rng);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
