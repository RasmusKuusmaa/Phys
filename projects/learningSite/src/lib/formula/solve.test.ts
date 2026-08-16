import { describe, it, expect } from "vitest";
import type { Formula } from "@/schema";
import { solve } from "./solve";

function localised(en: string, et: string) {
  return { en, et, sourceHash: "test", stale: false };
}

const newtonsSecondLaw: Formula = {
  id: "newtons-second-law",
  conceptId: "newtons-second-law",
  latex: "F = ma",
  symbols: [
    { symbol: "F", name: localised("force", "jõud"), unit: "N" },
    { symbol: "m", name: localised("mass", "mass"), unit: "kg" },
    { symbol: "a", name: localised("acceleration", "kiirendus"), unit: "m/s^2" },
  ],
  solveFor: ["F", "a", "m"],
  expressions: { F: "m * a", a: "F / m", m: "F / a" },
};

describe("solve", () => {
  const values = { F: 6, m: 2, a: 3 };

  it.each(newtonsSecondLaw.solveFor)("computes a correct value for every solve-for target (%s)", (target) => {
    const result = solve(newtonsSecondLaw, target, values);
    expect(result).toBeCloseTo(values[target as keyof typeof values], 10);
  });

  it("throws for an undeclared solve-for target", () => {
    expect(() => solve(newtonsSecondLaw, "z", values)).toThrow();
  });
});
