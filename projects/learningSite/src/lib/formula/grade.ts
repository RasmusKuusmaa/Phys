export type GradeResult = {
  correct: boolean;
  expected: number;
  given: number;
  relativeError: number;
};

/** `tolerance` is a relative error fraction (default 1%) — generous enough to absorb sig-fig rounding in the sampled inputs without accepting a wrong rearrangement. */
export function grade(given: number, expected: number, tolerance = 0.01): GradeResult {
  const relativeError =
    expected === 0 ? Math.abs(given) : Math.abs((given - expected) / expected);
  return { correct: relativeError <= tolerance, expected, given, relativeError };
}
