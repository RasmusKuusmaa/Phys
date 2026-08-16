import path from "node:path";
import { ErrorModelSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadErrorModels(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "error-models"),
    ErrorModelSchema,
  ).map((r) => r.value);
}
