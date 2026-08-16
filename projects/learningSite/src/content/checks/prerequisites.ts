import type { Concept } from "@/schema";

export type PrerequisiteIssue =
  | { type: "unresolved"; conceptId: string; missingPrerequisite: string }
  | { type: "cycle"; cycle: string[] };

/** Every `prerequisites` id must resolve to a loaded concept, and the prerequisite graph must be acyclic (the roadmap topological sort, Phase 7, fails otherwise). */
export function checkPrerequisites(concepts: Concept[]): PrerequisiteIssue[] {
  const issues: PrerequisiteIssue[] = [];
  const byId = new Map(concepts.map((c) => [c.id, c]));

  for (const concept of concepts) {
    for (const prereq of concept.prerequisites) {
      if (!byId.has(prereq)) {
        issues.push({
          type: "unresolved",
          conceptId: concept.id,
          missingPrerequisite: prereq,
        });
      }
    }
  }

  const UNVISITED = 0;
  const IN_PROGRESS = 1;
  const DONE = 2;
  const state = new Map<string, number>();
  const path: string[] = [];

  function visit(id: string) {
    state.set(id, IN_PROGRESS);
    path.push(id);
    for (const prereq of byId.get(id)?.prerequisites ?? []) {
      if (!byId.has(prereq)) continue; // reported above as unresolved
      const prereqState = state.get(prereq) ?? UNVISITED;
      if (prereqState === UNVISITED) {
        visit(prereq);
      } else if (prereqState === IN_PROGRESS) {
        const cycleStart = path.indexOf(prereq);
        issues.push({ type: "cycle", cycle: [...path.slice(cycleStart), prereq] });
      }
    }
    path.pop();
    state.set(id, DONE);
  }

  for (const concept of concepts) {
    if ((state.get(concept.id) ?? UNVISITED) === UNVISITED) visit(concept.id);
  }

  return issues;
}
