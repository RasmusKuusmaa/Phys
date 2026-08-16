import { describe, it, expect } from "vitest";
import type { ErrorModel } from "@/schema";
import { generateDistractors, buildOptions } from "./distractors";
import { createRng } from "./rng";

function localised(en: string, et: string) {
  return { en, et, sourceHash: "test", stale: false };
}

const errorModel: ErrorModel = {
  id: "newtons-second-law-force",
  formulaId: "newtons-second-law",
  solveFor: "F",
  mistakes: [
    { id: "forgot-mass", description: localised("Forgot to multiply by mass", "Unustas massiga korrutada"), expression: "a" },
    { id: "added-instead", description: localised("Added instead of multiplying", "Liitis korrutamise asemel"), expression: "m + a" },
    { id: "doubled", description: localised("Doubled the correct answer", "Kahekordistas õige vastuse"), expression: "2 * m * a" },
  ],
};

describe("generateDistractors", () => {
  it("never produces a distractor equal to the correct answer", () => {
    const values = { m: 2, a: 3 };
    const correct = values.m * values.a;
    const distractors = generateDistractors(errorModel, values);
    for (const distractor of distractors) {
      expect(distractor.value).not.toBeCloseTo(correct, 10);
    }
  });
});

describe("buildOptions", () => {
  it("marks exactly one option correct and it matches the correct value", () => {
    const values = { m: 2, a: 3 };
    const correct = values.m * values.a;
    const distractors = generateDistractors(errorModel, values);
    const options = buildOptions(correct, distractors, createRng(42));

    const correctOptions = options.filter((o) => o.isCorrect);
    expect(correctOptions).toHaveLength(1);
    expect(correctOptions[0].value).toBeCloseTo(correct, 10);
  });

  it("drops a distractor that collides with the correct answer", () => {
    const collidingModel: ErrorModel = {
      ...errorModel,
      mistakes: [
        ...errorModel.mistakes,
        { id: "same-as-correct", description: localised("Same as correct", "Sama mis õige"), expression: "m * a" },
      ],
    };
    const values = { m: 2, a: 3 };
    const correct = values.m * values.a;
    const distractors = generateDistractors(collidingModel, values);
    const options = buildOptions(correct, distractors, createRng(1));

    const wrongOptions = options.filter((o) => !o.isCorrect);
    for (const option of wrongOptions) {
      expect(option.value).not.toBeCloseTo(correct, 10);
    }
  });
});
