import { describe, it, expect } from "vitest";
import { loadElements } from "./elements";

const elements = loadElements();

describe("periodic table data", () => {
  it("has all 118 elements with no gaps or duplicates in Z", () => {
    expect(elements).toHaveLength(118);
    expect(elements.map((e) => e.z)).toEqual(Array.from({ length: 118 }, (_, i) => i + 1));
  });

  it("has a unique symbol for every element", () => {
    const symbols = elements.map((e) => e.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it("names every element in both locales", () => {
    // The bilingual policy is not negotiable per-record (see DECISIONS.md);
    // a half-translated table would ship a blank cell on the ET site.
    const missing = elements.filter((e) => !e.name.en.trim() || !e.name.et.trim());
    expect(missing.map((e) => e.symbol)).toEqual([]);
  });

  it("gives Estonian its own name rather than falling back to English", () => {
    // Many are genuinely identical (Indium, Hafnium, Erbium...), but the
    // common elements must be properly localised — this catches a lazily
    // copy-pasted block.
    const localised: Record<string, string> = {
      H: "Vesinik",
      O: "Hapnik",
      C: "Süsinik",
      N: "Lämmastik",
      Fe: "Raud",
      Au: "Kuld",
      Ag: "Hõbe",
      Cu: "Vask",
      Pb: "Plii",
      Hg: "Elavhõbe",
    };
    for (const [symbol, et] of Object.entries(localised)) {
      expect(elements.find((e) => e.symbol === symbol)?.name.et).toBe(et);
    }
  });

  it("puts exactly the lanthanides and actinides in the f-block", () => {
    const lanthanides = elements.filter((e) => e.category === "lanthanide").map((e) => e.z);
    const actinides = elements.filter((e) => e.category === "actinide").map((e) => e.z);
    expect(lanthanides).toEqual(range(57, 71));
    expect(actinides).toEqual(range(89, 103));
    expect(elements.filter((e) => e.block === "f").map((e) => e.z)).toEqual([
      ...range(57, 71),
      ...range(89, 103),
    ]);
  });

  it("gives every f-block element a null group and every other element a real one", () => {
    for (const element of elements) {
      if (element.block === "f") expect(element.group).toBeNull();
      else expect(element.group).not.toBeNull();
    }
  });

  it("never puts two elements in the same main-grid cell", () => {
    // A wrong group or period would silently stack two elements on top of
    // each other in the CSS grid, which is invisible in a schema check.
    const cells = elements
      .filter((e) => e.group !== null)
      .map((e) => `${e.period}:${e.group}`);
    expect(new Set(cells).size).toBe(cells.length);
  });

  it("places the landmark elements where the table says they belong", () => {
    const at = (symbol: string) => {
      const element = elements.find((e) => e.symbol === symbol)!;
      return { group: element.group, period: element.period };
    };
    expect(at("H")).toEqual({ group: 1, period: 1 });
    expect(at("He")).toEqual({ group: 18, period: 1 });
    expect(at("Fe")).toEqual({ group: 8, period: 4 });
    expect(at("Br")).toEqual({ group: 17, period: 4 });
    expect(at("Og")).toEqual({ group: 18, period: 7 });
  });

  it("keeps each period's group numbers strictly increasing with Z", () => {
    for (const period of [1, 2, 3, 4, 5, 6, 7]) {
      const groups = elements
        .filter((e) => e.period === period && e.group !== null)
        .map((e) => e.group!);
      expect(groups).toEqual([...groups].sort((a, b) => a - b));
    }
  });

  it("uses a positive mass for every element", () => {
    expect(elements.filter((e) => !(e.mass > 0))).toEqual([]);
  });
});

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
