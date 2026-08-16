import type { FormulaSelectionItem } from "@/schema";
import type { ConceptGradeResult } from "./multipleChoice";

export function gradeFormulaSelection(
  item: FormulaSelectionItem,
  selectedOptionId: string,
): ConceptGradeResult {
  const selected = item.options.find((o) => o.id === selectedOptionId);
  if (!selected) {
    throw new Error(`Unknown option id "${selectedOptionId}" for item "${item.id}"`);
  }
  return { correct: selected.correct, misconceptionId: selected.misconceptionId };
}
