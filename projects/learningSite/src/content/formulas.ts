import path from "node:path";
import { FormulaSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadFormulas(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "formulas"),
    FormulaSchema,
  ).map((r) => r.value);
}
