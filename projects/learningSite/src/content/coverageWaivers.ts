/**
 * Concepts that are knowingly mid-authoring: their coverage issues are
 * reported as warnings instead of failing the build.
 *
 * This list exists so coverage enforcement can be switched on *before* the
 * backlog is cleared rather than after. Any concept **not** listed here must
 * be complete — so a newly added concept fails immediately unless the author
 * deliberately waives it, which is the failure mode this guards against
 * (Phase 11b shipped 29 concepts with no misconceptions, items or resources
 * and nothing complained until the deploy).
 *
 * Rules:
 * - Deleting entries is the goal. Adding one is a deliberate, temporary act.
 * - A waiver for a concept that is already complete is itself an error, so
 *   the list can't rot silently — `validate:content` fails on stale waivers.
 */
export const COVERAGE_WAIVERS: Record<string, readonly string[]> = {
  // Empty, and worth keeping that way: physics cleared its Phase 11b backlog,
  // so every concept in the repo is currently complete and enforcement is
  // unconditional. Add a subject key only while actively authoring one.
};

export function waivedConcepts(subject: string): Set<string> {
  return new Set(COVERAGE_WAIVERS[subject] ?? []);
}
