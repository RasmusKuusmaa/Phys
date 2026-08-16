import path from "node:path";
import { ResourceSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadResources(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "resources"),
    ResourceSchema,
  ).map((r) => r.value);
}
