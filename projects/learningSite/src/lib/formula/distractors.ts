import type { ErrorModel } from "@/schema";
import { evaluate } from "./expression";
import type { Rng } from "./rng";

export type Distractor = {
  mistakeId: string;
  value: number;
  misconceptionId?: string;
};

/** Evaluates each mistake's expression against the same variable scope as the correct solve, producing one distractor per mistake. */
export function generateDistractors(
  errorModel: ErrorModel,
  values: Record<string, number>,
): Distractor[] {
  return errorModel.mistakes.map((mistake) => ({
    mistakeId: mistake.id,
    value: evaluate(mistake.expression, values),
    misconceptionId: mistake.misconceptionId,
  }));
}

export type Option = {
  value: number;
  isCorrect: boolean;
  mistakeId?: string;
};

function valuesCollide(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) <= epsilon * Math.max(1, Math.abs(a), Math.abs(b));
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Drops any distractor that collides with the correct answer or an
 * already-accepted distractor (two mistakes can legitimately produce the
 * same wrong number), then shuffles with the same seeded RNG as the
 * problem instantiation so option order is reproducible too.
 */
export function buildOptions(
  correctValue: number,
  distractors: Distractor[],
  rng: Rng,
): Option[] {
  const options: Option[] = [{ value: correctValue, isCorrect: true }];
  for (const distractor of distractors) {
    if (options.some((o) => valuesCollide(o.value, distractor.value))) continue;
    options.push({ value: distractor.value, isCorrect: false, mistakeId: distractor.mistakeId });
  }
  return shuffle(options, rng);
}
