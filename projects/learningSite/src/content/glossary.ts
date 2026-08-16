import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GlossaryEntrySchema } from "@/schema";

const GLOSSARY_PATH = path.join(process.cwd(), "content", "terminology", "glossary.json");

export function loadGlossary() {
  const raw = readFileSync(GLOSSARY_PATH, "utf8");
  return z.array(GlossaryEntrySchema).parse(JSON.parse(raw));
}
