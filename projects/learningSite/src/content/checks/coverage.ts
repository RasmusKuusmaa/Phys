import type {
  Concept,
  ConceptItem,
  ErrorModel,
  Formula,
  Misconception,
  ProblemTemplate,
} from "@/schema";

/**
 * A concept is only "authored" once it has the full set of pieces a concept
 * page renders from. Resource-per-locale coverage lives in `./locales` with
 * the other locale checks; everything else a concept needs is here.
 *
 * This exists because a concept can satisfy every per-file schema and still
 * be half-finished — the Phase 11b concepts shipped with formulas but no
 * misconceptions, items or resources, and nothing failed until the deploy.
 */
export const MIN_MISCONCEPTIONS_PER_CONCEPT = 3;
export const MIN_ITEMS_PER_CONCEPT = 1;

export type CoverageIssue =
  | {
      type: "insufficient-misconceptions";
      conceptId: string;
      found: number;
      required: number;
    }
  | { type: "insufficient-concept-items"; conceptId: string; found: number; required: number }
  | { type: "missing-explanation"; conceptId: string; locale: string }
  | { type: "formula-without-problem-template"; formulaId: string; conceptId: string }
  | { type: "formula-without-error-model"; formulaId: string; conceptId: string }
  | { type: "orphan-record"; kind: string; recordId: string; conceptId: string }
  | {
      type: "unknown-misconception-reference";
      itemId: string;
      optionId: string;
      misconceptionId: string;
    };

export type CoverageInput = {
  concepts: Concept[];
  misconceptions: Misconception[];
  items: ConceptItem[];
  formulas: Formula[];
  problemTemplates: ProblemTemplate[];
  errorModels: ErrorModel[];
  /** Basenames present in `content/<subject>/explanations`, e.g. `["torque-en.mdx"]`. */
  explanationFiles: string[];
  locales: readonly string[];
};

function countBy<T>(records: T[], key: (record: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    const k = key(record);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/**
 * Explanations are optional by design (a concept page degrades gracefully
 * without one), so `missing-explanation` is reported for the coverage
 * report but is not one of the blocking issue types — see `isBlocking`.
 */
export function isBlocking(issue: CoverageIssue): boolean {
  return issue.type !== "missing-explanation";
}

export function checkConceptCoverage(input: CoverageInput): CoverageIssue[] {
  const issues: CoverageIssue[] = [];
  const conceptIds = new Set(input.concepts.map((c) => c.id));
  const misconceptionIds = new Set(input.misconceptions.map((m) => m.id));

  const misconceptionCounts = countBy(input.misconceptions, (m) => m.conceptId);
  const itemCounts = countBy(input.items, (i) => i.conceptId);
  const explanations = new Set(input.explanationFiles);

  for (const concept of input.concepts) {
    const misconceptions = misconceptionCounts.get(concept.id) ?? 0;
    if (misconceptions < MIN_MISCONCEPTIONS_PER_CONCEPT) {
      issues.push({
        type: "insufficient-misconceptions",
        conceptId: concept.id,
        found: misconceptions,
        required: MIN_MISCONCEPTIONS_PER_CONCEPT,
      });
    }

    const items = itemCounts.get(concept.id) ?? 0;
    if (items < MIN_ITEMS_PER_CONCEPT) {
      issues.push({
        type: "insufficient-concept-items",
        conceptId: concept.id,
        found: items,
        required: MIN_ITEMS_PER_CONCEPT,
      });
    }

    for (const locale of input.locales) {
      if (!explanations.has(`${concept.id}-${locale}.mdx`)) {
        issues.push({ type: "missing-explanation", conceptId: concept.id, locale });
      }
    }
  }

  // A record pointing at a concept id that doesn't exist is silently invisible
  // on the site — it renders nowhere and no other check catches it.
  const orphanSources: [string, { id: string; conceptId: string }[]][] = [
    ["misconception", input.misconceptions],
    ["concept-item", input.items],
    ["formula", input.formulas],
  ];
  for (const [kind, records] of orphanSources) {
    for (const record of records) {
      if (!conceptIds.has(record.conceptId)) {
        issues.push({
          type: "orphan-record",
          kind,
          recordId: record.id,
          conceptId: record.conceptId,
        });
      }
    }
  }

  const templatedFormulaIds = new Set(input.problemTemplates.map((t) => t.formulaId));
  const modelledFormulaIds = new Set(input.errorModels.map((e) => e.formulaId));
  for (const formula of input.formulas) {
    if (!templatedFormulaIds.has(formula.id)) {
      issues.push({
        type: "formula-without-problem-template",
        formulaId: formula.id,
        conceptId: formula.conceptId,
      });
    }
    if (!modelledFormulaIds.has(formula.id)) {
      issues.push({
        type: "formula-without-error-model",
        formulaId: formula.id,
        conceptId: formula.conceptId,
      });
    }
  }

  for (const item of input.items) {
    if (item.type === "ordering") continue;
    for (const option of item.options) {
      if (option.misconceptionId && !misconceptionIds.has(option.misconceptionId)) {
        issues.push({
          type: "unknown-misconception-reference",
          itemId: item.id,
          optionId: option.id,
          misconceptionId: option.misconceptionId,
        });
      }
    }
  }

  return issues;
}

export function describeCoverageIssue(subject: string, issue: CoverageIssue): string {
  switch (issue.type) {
    case "insufficient-misconceptions":
      return `[${subject}] concept "${issue.conceptId}" has ${issue.found} misconception(s), needs ${issue.required}`;
    case "insufficient-concept-items":
      return `[${subject}] concept "${issue.conceptId}" has ${issue.found} concept item(s), needs ${issue.required}`;
    case "missing-explanation":
      return `[${subject}] concept "${issue.conceptId}" has no explanations/${issue.conceptId}-${issue.locale}.mdx`;
    case "formula-without-problem-template":
      return `[${subject}] formula "${issue.formulaId}" has no problem template`;
    case "formula-without-error-model":
      return `[${subject}] formula "${issue.formulaId}" has no error model`;
    case "orphan-record":
      return `[${subject}] ${issue.kind} "${issue.recordId}" references unknown concept "${issue.conceptId}"`;
    case "unknown-misconception-reference":
      return `[${subject}] item "${issue.itemId}" option "${issue.optionId}" references unknown misconception "${issue.misconceptionId}"`;
  }
}

/** The concept a coverage issue belongs to, for grouping against the waiver list. */
export function coverageIssueConceptId(issue: CoverageIssue): string {
  switch (issue.type) {
    case "unknown-misconception-reference":
      return issue.itemId;
    default:
      return issue.conceptId;
  }
}
