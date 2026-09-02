import { z } from "zod";

/**
 * L0-L3 were originally hard-capped (see todo.md's build spec and
 * DECISIONS.md's history) while the site covered a bachelor's degree. L4
 * ("Master's core") was added once that scope explicitly widened to
 * graduate-level material — see DECISIONS.md § Level taxonomy for why, and
 * for the same caution against adding a level casually that the original
 * cap was written to enforce.
 */
export const LevelSchema = z.enum(["L0", "L1", "L2", "L3", "L4"]);

export type Level = z.infer<typeof LevelSchema>;

export const levelOrder: readonly Level[] = ["L0", "L1", "L2", "L3", "L4"];
