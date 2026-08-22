import { describe, it, expect } from "vitest";
import { encodeProgressCode, decodeProgressCode } from "./code";
import type { Progress } from "./schema";

const sample: Progress = {
  version: 1,
  conceptStatus: { "newtons-second-law": "confident" },
  misconceptionHits: { "sign-error": 2 },
};

describe("progress export/import code", () => {
  it("round-trips through encode/decode", () => {
    expect(decodeProgressCode(encodeProgressCode(sample))).toEqual(sample);
  });

  it("tolerates surrounding whitespace on decode", () => {
    expect(decodeProgressCode(`  ${encodeProgressCode(sample)}  \n`)).toEqual(sample);
  });

  it("returns null for garbage input rather than throwing", () => {
    expect(decodeProgressCode("not valid base64!!")).toBeNull();
    expect(decodeProgressCode("")).toBeNull();
  });

  it("returns null for a code that decodes to the wrong shape", () => {
    expect(decodeProgressCode(btoa(JSON.stringify({ foo: "bar" })))).toBeNull();
  });
});
