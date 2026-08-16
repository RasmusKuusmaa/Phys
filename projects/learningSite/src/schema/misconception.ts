import { z } from "zod";
import { LocalisedStringSchema } from "./localisedString";

export const MisconceptionSchema = z.object({
  id: z.string().min(1),
  conceptId: z.string().min(1),
  text: LocalisedStringSchema,
});

export type Misconception = z.infer<typeof MisconceptionSchema>;
