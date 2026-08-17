import { z } from "zod";
import { LevelSchema } from "./level";

export const TestModeSchema = z.enum(["concept", "formula", "mixed"]);

export const TestConfigSchema = z.object({
  subject: z.string().min(1),
  levels: z.array(LevelSchema).min(1),
  conceptIds: z.array(z.string().min(1)).min(1),
  itemCount: z.number().int().positive(),
  mode: TestModeSchema,
});

export type TestMode = z.infer<typeof TestModeSchema>;
export type TestConfig = z.infer<typeof TestConfigSchema>;
