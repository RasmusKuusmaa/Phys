import { z } from "zod";
import { locales } from "@/i18n/locales";

/**
 * No accounts, no backend yet — notes live entirely in the browser's
 * localStorage, same as progress. `version` is the discriminant the
 * migration chain walks forward, so a notebook written by an older build
 * gets carried forward rather than silently reset. When accounts arrive,
 * this shape is what gets synced; nothing above the store layer knows
 * where the bytes actually live.
 */
export const CURRENT_NOTEBOOK_VERSION = 2;

/**
 * What a note can be *about*. These mirror the three things the global
 * search already indexes, so anything a learner can find is also
 * something they can attach a note to.
 */
export const NoteTargetKindSchema = z.enum(["concept", "formula", "glossary"]);
export type NoteTargetKind = z.infer<typeof NoteTargetKindSchema>;

export const NoteLinkSchema = z.object({
  kind: NoteTargetKindSchema,
  id: z.string().min(1),
});
export type NoteLink = z.infer<typeof NoteLinkSchema>;

/**
 * A link target resolved for display — built server-side per locale (see
 * `targets.ts`) and handed to the client, since content lives on disk and
 * labels are localised. Not persisted: stored notes keep only `NoteLink`,
 * so renaming a concept re-labels every note that points at it.
 */
export type NoteTarget = {
  kind: NoteTargetKind;
  id: string;
  label: string;
  /** Where the target lives, so a note's links are clickable. */
  href: string;
};

/** Stable key for a link/target pair — ids are only unique within a kind. */
export function noteLinkKey(link: { kind: NoteTargetKind; id: string }): string {
  return `${link.kind}:${link.id}`;
}

/**
 * A W3C-Annotation-style text anchor: the quoted text plus a little
 * surrounding context, and the offset it sat at when captured.
 *
 * Deliberately *not* a DOM path or a bare offset. Prose is static per
 * build, but it does get re-authored, and a bare offset silently points
 * at the wrong sentence the moment a paragraph above it grows. Matching
 * on the quote itself means a highlight either lands on the same words it
 * was made on or reports itself as orphaned — never quietly drifts.
 */
export const TextAnchorSchema = z.object({
  exact: z.string().min(1),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  /** Where `exact` sat at capture time. A disambiguation hint between identical quotes, not a guarantee. */
  start: z.number().int().nonnegative(),
});
export type TextAnchor = z.infer<typeof TextAnchorSchema>;

export const HighlightSchema = z.object({
  id: z.string().min(1),
  noteId: z.string().min(1),
  conceptId: z.string().min(1),
  /**
   * The EN and ET explanations are different prose, not translations of
   * one string — an anchor made in one locale cannot resolve in the
   * other, so it is only ever painted on the locale it was made in.
   */
  locale: z.enum(locales),
  /** Which region of the page the offsets are relative to, so one page can host several independent anchor spaces. */
  containerKey: z.string().min(1),
  anchor: TextAnchorSchema,
  createdAt: z.string().min(1),
});
export type Highlight = z.infer<typeof HighlightSchema>;

export const NoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().default(""),
  body: z.string().default(""),
  links: z.array(NoteLinkSchema).default([]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type Note = z.infer<typeof NoteSchema>;

export const NotebookV1Schema = z.object({
  version: z.literal(1),
  /** Keyed by note id. */
  notes: z.record(z.string(), NoteSchema).default({}),
  /** Keyed by highlight id. Separate from notes so "every highlight on this page" is one filter, not a scan of every note. */
  highlights: z.record(z.string(), HighlightSchema).default({}),
});
export type NotebookV1 = z.infer<typeof NotebookV1Schema>;

/**
 * v2 adds tombstones, which only became necessary once notebooks sync
 * between devices.
 *
 * Merging two notebooks by taking the union of their notes would resurrect
 * anything deleted on one device but still present on the other — the
 * deletion is an absence, and an absence carries no timestamp to compare.
 * Recording *when* an id was deleted makes the removal a fact that can win
 * a comparison like any other edit.
 */
export const NotebookV2Schema = z.object({
  version: z.literal(2),
  notes: z.record(z.string(), NoteSchema).default({}),
  highlights: z.record(z.string(), HighlightSchema).default({}),
  /** Note id → ISO timestamp of deletion. */
  deletedNotes: z.record(z.string(), z.string()).default({}),
  /** Highlight id → ISO timestamp of deletion. */
  deletedHighlights: z.record(z.string(), z.string()).default({}),
});
export type NotebookV2 = z.infer<typeof NotebookV2Schema>;

export const NotebookSchema = NotebookV2Schema;
export type Notebook = NotebookV2;

export function createEmptyNotebook(): Notebook {
  return {
    version: CURRENT_NOTEBOOK_VERSION,
    notes: {},
    highlights: {},
    deletedNotes: {},
    deletedHighlights: {},
  };
}
