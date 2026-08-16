import { describe, it, expect } from "vitest";
import { parseNumericInput, parseAnswerWithUnit, answerUnitMatches } from "./parseAnswer";

describe("parseNumericInput", () => {
  it("accepts decimal point input (English)", () => {
    expect(parseNumericInput("9.81")).toBeCloseTo(9.81, 10);
  });

  it("accepts decimal comma input (Estonian)", () => {
    expect(parseNumericInput("9,81")).toBeCloseTo(9.81, 10);
  });

  it("accepts scientific notation with either separator", () => {
    expect(parseNumericInput("1.5e3")).toBeCloseTo(1500, 10);
    expect(parseNumericInput("1,5e3")).toBeCloseTo(1500, 10);
  });

  it("accepts a leading sign", () => {
    expect(parseNumericInput("-3,2")).toBeCloseTo(-3.2, 10);
  });

  it("rejects ambiguous input with both separators", () => {
    expect(parseNumericInput("1,234.56")).toBeNull();
  });

  it("rejects empty and non-numeric input", () => {
    expect(parseNumericInput("")).toBeNull();
    expect(parseNumericInput("abc")).toBeNull();
  });
});

describe("parseAnswerWithUnit", () => {
  it("splits value and unit for English-formatted input", () => {
    expect(parseAnswerWithUnit("9.81 m/s^2")).toEqual({ value: 9.81, unit: "m/s^2" });
  });

  it("splits value and unit for Estonian-formatted input", () => {
    expect(parseAnswerWithUnit("9,81 m/s^2")).toEqual({ value: 9.81, unit: "m/s^2" });
  });

  it("returns a null unit when none is given", () => {
    expect(parseAnswerWithUnit("9,81")).toEqual({ value: 9.81, unit: null });
  });
});

describe("answerUnitMatches", () => {
  it("accepts the same unit", () => {
    expect(answerUnitMatches("m/s^2", "m/s^2")).toBe(true);
  });

  it("rejects dimensionally different units", () => {
    expect(answerUnitMatches("m/s^2", "N")).toBe(false);
  });

  it("rejects unknown units", () => {
    expect(answerUnitMatches("banana", "N")).toBe(false);
  });
});
