import { describe, it, expect } from "vitest";
import { loadElements } from "@/content/elements";
import { elementPlacement, LANTHANIDE_ROW, ACTINIDE_ROW } from "./layout";

const elements = loadElements();
const bySymbol = (symbol: string) => elements.find((e) => e.symbol === symbol)!;

describe("elementPlacement", () => {
  it("places main-block elements at their group and period", () => {
    expect(elementPlacement(bySymbol("H"))).toEqual({ column: 1, row: 1 });
    expect(elementPlacement(bySymbol("He"))).toEqual({ column: 18, row: 1 });
    expect(elementPlacement(bySymbol("Fe"))).toEqual({ column: 8, row: 4 });
    expect(elementPlacement(bySymbol("Og"))).toEqual({ column: 18, row: 7 });
  });

  it("lays the lanthanides out left to right in their own row", () => {
    expect(elementPlacement(bySymbol("La"))).toEqual({ column: 3, row: LANTHANIDE_ROW });
    expect(elementPlacement(bySymbol("Lu"))).toEqual({ column: 17, row: LANTHANIDE_ROW });
  });

  it("lays the actinides out left to right in their own row", () => {
    expect(elementPlacement(bySymbol("Ac"))).toEqual({ column: 3, row: ACTINIDE_ROW });
    expect(elementPlacement(bySymbol("Lr"))).toEqual({ column: 17, row: ACTINIDE_ROW });
  });

  it("gives all 118 elements a distinct cell", () => {
    // The check that actually matters: any wrong group, period or f-block
    // offset stacks two elements in one cell, hiding one of them.
    const cells = elements.map(elementPlacement).map((p) => `${p.row}:${p.column}`);
    expect(new Set(cells).size).toBe(118);
  });

  it("keeps every element inside the 18-column grid", () => {
    for (const element of elements) {
      const { column, row } = elementPlacement(element);
      expect(column).toBeGreaterThanOrEqual(1);
      expect(column).toBeLessThanOrEqual(18);
      expect(row).toBeGreaterThanOrEqual(1);
      expect(row).toBeLessThanOrEqual(ACTINIDE_ROW);
    }
  });

  it("leaves row 8 empty as the gap between the main table and the f-block", () => {
    expect(elements.map(elementPlacement).some((p) => p.row === 8)).toBe(false);
  });

  it("fills both f-block rows completely, columns 3 through 17", () => {
    for (const row of [LANTHANIDE_ROW, ACTINIDE_ROW]) {
      const columns = elements
        .map(elementPlacement)
        .filter((p) => p.row === row)
        .map((p) => p.column)
        .sort((a, b) => a - b);
      expect(columns).toEqual(Array.from({ length: 15 }, (_, i) => i + 3));
    }
  });
});
