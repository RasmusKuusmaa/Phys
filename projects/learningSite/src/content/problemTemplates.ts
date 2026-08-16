import path from "node:path";
import { ProblemTemplateSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadProblemTemplates(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "problem-templates"),
    ProblemTemplateSchema,
  ).map((r) => r.value);
}
