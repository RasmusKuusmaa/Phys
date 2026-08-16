import type { ConceptItem } from "@/schema";

export type ConceptItemIssue = {
  type: "untagged-wrong-option";
  itemId: string;
  optionId: string;
};

/**
 * Every wrong option should name the misconception it represents, so
 * results (Phase 5) can summarise which misconceptions a learner keeps
 * hitting. Ordering items have no discrete "wrong option" concept, so
 * they're exempt.
 */
export function checkWrongOptionsTagged(items: ConceptItem[]): ConceptItemIssue[] {
  const issues: ConceptItemIssue[] = [];
  for (const item of items) {
    if (item.type === "ordering") continue;
    for (const option of item.options) {
      if (!option.correct && !option.misconceptionId) {
        issues.push({ type: "untagged-wrong-option", itemId: item.id, optionId: option.id });
      }
    }
  }
  return issues;
}
