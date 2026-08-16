import path from "node:path";
import { ConceptSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadConcepts(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "concepts"),
    ConceptSchema,
  ).map((r) => r.value);
}
