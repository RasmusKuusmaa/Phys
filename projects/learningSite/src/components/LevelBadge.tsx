import type { Level } from "@/schema";

const LEVEL_COLOR_CLASS: Record<Level, string> = {
  L0: "bg-level-l0",
  L1: "bg-level-l1",
  L2: "bg-level-l2",
  L3: "bg-level-l3",
};

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${LEVEL_COLOR_CLASS[level]}`}
    >
      {level}
    </span>
  );
}
