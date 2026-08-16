import type { MultipleChoiceItem } from "@/schema";

export type ConceptGradeResult = {
  correct: boolean;
  misconceptionId?: string;
};

export function gradeMultipleChoice(
  item: MultipleChoiceItem,
  selectedOptionId: string,
): ConceptGradeResult {
  const selected = item.options.find((o) => o.id === selectedOptionId);
  if (!selected) {
    throw new Error(`Unknown option id "${selectedOptionId}" for item "${item.id}"`);
  }
  return { correct: selected.correct, misconceptionId: selected.misconceptionId };
}
