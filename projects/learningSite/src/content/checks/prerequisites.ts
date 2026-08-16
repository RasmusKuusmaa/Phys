import type { Concept } from "@/schema";

export type PrerequisiteIssue = {
  type: "unresolved";
  conceptId: string;
  missingPrerequisite: string;
};

/** Every `prerequisites` id must resolve to a loaded concept. */
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

  return issues;
}
