import type { Element } from "@/schema";

/**
 * Where each element sits in the 18-column grid.
 *
 * The f-block is pulled out into two rows below the main table — the
 * conventional presentation, and the reason lanthanides and actinides
 * carry no group number in the data. Row 8 is left empty as the gap.
 */
export const FIRST_F_BLOCK_COLUMN = 3;
export const LANTHANIDE_ROW = 9;
export const ACTINIDE_ROW = 10;
export const LANTHANIDE_START = 57;
export const ACTINIDE_START = 89;

export type Placement = { column: number; row: number };

export function elementPlacement(element: Element): Placement {
  if (element.category === "lanthanide") {
    return {
      column: FIRST_F_BLOCK_COLUMN + (element.z - LANTHANIDE_START),
      row: LANTHANIDE_ROW,
    };
  }
  if (element.category === "actinide") {
    return {
      column: FIRST_F_BLOCK_COLUMN + (element.z - ACTINIDE_START),
      row: ACTINIDE_ROW,
    };
  }
  // Everything else is exactly where its group and period say it is.
  return { column: element.group!, row: element.period };
}

/**
 * The two "57-71" / "89-103" stand-ins that hold group 3 open in periods 6
 * and 7, pointing at the rows below.
 */
export const F_BLOCK_PLACEHOLDERS: { row: number; label: string; pointsTo: number }[] = [
  { row: 6, label: "57-71", pointsTo: LANTHANIDE_ROW },
  { row: 7, label: "89-103", pointsTo: ACTINIDE_ROW },
];
