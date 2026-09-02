"use client";

import { useProgress } from "@/lib/progress/useProgress";
import { getConceptStatus, setConceptStatus } from "@/lib/progress/store";
import { ConceptStatusSchema, type ConceptStatus } from "@/lib/progress/schema";

const STATUS_LABELS: Record<ConceptStatus, string> = {
  unseen: "Unseen",
  learning: "Learning",
  confident: "Confident",
};

/** Null until the client hydrates (see useProgress) — renders nothing rather than guessing, so there's no flash of the wrong status. */
export function ConceptStatusControl({ conceptId }: { conceptId: string }) {
  const progress = useProgress();
  if (progress === null) return null;

  const status = getConceptStatus(progress, conceptId);

  return (
    <div className="mt-6 flex items-center gap-2 text-sm">
      <span className="text-muted">Status:</span>
      {ConceptStatusSchema.options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setConceptStatus(conceptId, option)}
          aria-pressed={status === option}
          className={
            status === option
              ? "rounded-full bg-accent px-3 py-1 text-white hover:bg-accent-hover"
              : "rounded-full border border-border px-3 py-1 hover:border-accent"
          }
        >
          {STATUS_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
