import type { Concept } from "@/schema";

/**
 * Kahn's algorithm: a concept becomes eligible once every prerequisite that
 * exists in `concepts` has already been placed. Assumes the graph is
 * acyclic — `checkPrerequisites` (Phase 2) is what actually validates that
 * at build time; this throws rather than silently truncating if it isn't.
 * Ties are broken by input order, so re-sorting the same concept list is
 * deterministic.
 */
export function topologicalSort(concepts: Concept[]): Concept[] {
  const byId = new Map(concepts.map((c) => [c.id, c]));
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const concept of concepts) {
    inDegree.set(concept.id, 0);
    dependents.set(concept.id, []);
  }
  for (const concept of concepts) {
    for (const prereq of concept.prerequisites) {
      if (!byId.has(prereq)) continue; // unresolved refs are checkPrerequisites's concern
      inDegree.set(concept.id, (inDegree.get(concept.id) ?? 0) + 1);
      dependents.get(prereq)!.push(concept.id);
    }
  }

  const queue = concepts.filter((c) => inDegree.get(c.id) === 0).map((c) => c.id);
  const order: Concept[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(byId.get(id)!);
    for (const dependentId of dependents.get(id) ?? []) {
      const newDegree = (inDegree.get(dependentId) ?? 0) - 1;
      inDegree.set(dependentId, newDegree);
      if (newDegree === 0) queue.push(dependentId);
    }
  }

  if (order.length !== concepts.length) {
    throw new Error("Cannot derive a study order: the prerequisite graph has a cycle");
  }

  return order;
}
