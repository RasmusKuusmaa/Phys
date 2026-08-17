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

export type MisconceptionCount = {
  misconceptionId: string;
  count: number;
};

/** Sorted most-repeated first, so the results screen can surface the error patterns a learner keeps hitting. */
export function computeMisconceptionCounts(answers: AnswerRecord[]): MisconceptionCount[] {
  const counts = new Map<string, number>();
  for (const answer of answers) {
    if (!answer.correct && answer.misconceptionId) {
      counts.set(answer.misconceptionId, (counts.get(answer.misconceptionId) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([misconceptionId, count]) => ({ misconceptionId, count }))
    .sort((a, b) => b.count - a.count);
}
