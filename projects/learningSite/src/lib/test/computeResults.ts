import type { AnswerRecord } from "./runnerItem";

export type ConceptResult = {
  conceptId: string;
  correct: number;
  total: number;
  accuracy: number;
};

/** Below this accuracy, a concept is flagged for review on the results screen. */
const WEAK_THRESHOLD = 0.7;

export function computeConceptResults(answers: AnswerRecord[]): ConceptResult[] {
  const byConcept = new Map<string, { correct: number; total: number }>();
  for (const answer of answers) {
    const entry = byConcept.get(answer.conceptId) ?? { correct: 0, total: 0 };
    entry.total++;
    if (answer.correct) entry.correct++;
    byConcept.set(answer.conceptId, entry);
  }
  return [...byConcept.entries()].map(([conceptId, { correct, total }]) => ({
    conceptId,
    correct,
    total,
    accuracy: correct / total,
  }));
}

export function isWeakConcept(result: ConceptResult): boolean {
  return result.accuracy < WEAK_THRESHOLD;
}
