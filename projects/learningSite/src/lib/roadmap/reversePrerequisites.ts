import type { Concept } from "@/schema";

/** For each concept, the concepts that list it as a prerequisite — the "what does finishing this unlock" view, the mirror image of `Concept.prerequisites`. */
export function computeUnlocks(concepts: Concept[]): Map<string, Concept[]> {
  const unlocks = new Map<string, Concept[]>();
  for (const concept of concepts) unlocks.set(concept.id, []);
  for (const concept of concepts) {
    for (const prereq of concept.prerequisites) {
      unlocks.get(prereq)?.push(concept);
    }
  }
  return unlocks;
}
