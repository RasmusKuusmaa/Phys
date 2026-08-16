import { z } from "zod";

/** Hard-capped at L3 — see todo.md build spec. Do not add levels beyond this. */
export const LevelSchema = z.enum(["L0", "L1", "L2", "L3"]);

export type Level = z.infer<typeof LevelSchema>;

export const levelOrder: readonly Level[] = ["L0", "L1", "L2", "L3"];
