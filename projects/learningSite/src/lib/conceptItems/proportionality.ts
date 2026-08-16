import type { ProportionalityItem } from "@/schema";
import type { ConceptGradeResult } from "./multipleChoice";

/** The actual multiplier a quantity undergoes under a given relationship — used to validate that an item's marked-correct option is actually correct, not just self-consistent. */
export function computeProportionalityMultiplier(
  relationship: ProportionalityItem["relationship"],
  changeFactor: number,
): number {
  switch (relationship) {
    case "direct":
      return changeFactor;
    case "inverse":
      return 1 / changeFactor;
    case "direct-square":
      return changeFactor ** 2;
    case "inverse-square":
      return 1 / changeFactor ** 2;
  }
}

export function gradeProportionality(
  item: ProportionalityItem,
  selectedOptionId: string,
): ConceptGradeResult {
  const selected = item.options.find((o) => o.id === selectedOptionId);
  if (!selected) {
    throw new Error(`Unknown option id "${selectedOptionId}" for item "${item.id}"`);
  }
  return { correct: selected.correct, misconceptionId: selected.misconceptionId };
}
