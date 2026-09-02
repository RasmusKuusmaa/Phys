import path from "node:path";
import { z } from "zod";
import { ElementSchema } from "@/schema";
import { CONTENT_ROOT, loadJsonArrayFile } from "./loader";

const ELEMENTS_PATH = path.join(CONTENT_ROOT, "reference", "elements.json");

/** The periodic table, in atomic-number order. Validated against `ElementSchema` at build time. */
export function loadElements() {
  return loadJsonArrayFile(ELEMENTS_PATH, z.array(ElementSchema)).sort((a, b) => a.z - b.z);
}
