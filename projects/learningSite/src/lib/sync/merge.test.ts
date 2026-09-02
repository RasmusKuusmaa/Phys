import { describe, it, expect } from "vitest";
import { mergeNotebooks, mergeProgress } from "./merge";
import { createEmptyNotebook, type Note, type Notebook } from "@/lib/notes/schema";
import { createEmptyProgress, type Progress } from "@/lib/progress/schema";

function note(id: string, title: string, updatedAt: string): Note {
  return { id, title, body: "", links: [], createdAt: "2026-01-01T00:00:00.000Z", updatedAt };
}

function notebook(partial: Partial<Notebook>): Notebook {
  return { ...createEmptyNotebook(), ...partial };
}

const T1 = "2026-09-01T10:00:00.000Z";
const T2 = "2026-09-01T11:00:00.000Z";
const T3 = "2026-09-01T12:00:00.000Z";

describe("mergeNotebooks", () => {
  it("keeps notes that exist on only one side", () => {
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Mine", T1) } }),
      notebook({ notes: { b: note("b", "Theirs", T1) } }),
    );
    expect(Object.keys(merged.notes).sort()).toEqual(["a", "b"]);
  });

  it("takes the more recently edited copy of a note edited on both devices", () => {
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Older", T1) } }),
      notebook({ notes: { a: note("a", "Newer", T2) } }),
    );
    expect(merged.notes.a!.title).toBe("Newer");
  });

  it("does not resurrect a note deleted on the other device", () => {
    // The whole reason tombstones exist: local still has the note, remote
    // deleted it later. A union would bring it back.
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Mine", T1) } }),
      notebook({ deletedNotes: { a: T2 } }),
    );
    expect(merged.notes.a).toBeUndefined();
    expect(merged.deletedNotes.a).toBe(T2);
  });

  it("brings a note back when it was edited after the deletion", () => {
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Edited later", T3) } }),
      notebook({ deletedNotes: { a: T2 } }),
    );
    expect(merged.notes.a?.title).toBe("Edited later");
  });

  it("is symmetric — merging either direction gives the same notes", () => {
    const left = notebook({ notes: { a: note("a", "Older", T1), c: note("c", "Only mine", T1) } });
    const right = notebook({ notes: { a: note("a", "Newer", T2) }, deletedNotes: { c: T3 } });
    const ab = mergeNotebooks(left, right);
    const ba = mergeNotebooks(right, left);
    expect(Object.keys(ab.notes).sort()).toEqual(Object.keys(ba.notes).sort());
    expect(ab.notes.a!.title).toBe(ba.notes.a!.title);
  });

  it("drops highlights whose note is gone", () => {
    const highlight = {
      id: "h1",
      noteId: "a",
      conceptId: "c1",
      locale: "en" as const,
      containerKey: "explanation",
      anchor: { exact: "x", prefix: "", suffix: "", start: 0 },
      createdAt: T1,
    };
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Mine", T1) }, highlights: { h1: highlight } }),
      notebook({ deletedNotes: { a: T2 } }),
    );
    expect(merged.highlights.h1).toBeUndefined();
  });

  it("does not resurrect an individually removed highlight", () => {
    const highlight = {
      id: "h1",
      noteId: "a",
      conceptId: "c1",
      locale: "en" as const,
      containerKey: "explanation",
      anchor: { exact: "x", prefix: "", suffix: "", start: 0 },
      createdAt: T1,
    };
    const merged = mergeNotebooks(
      notebook({ notes: { a: note("a", "Mine", T1) }, highlights: { h1: highlight } }),
      notebook({ notes: { a: note("a", "Mine", T1) }, deletedHighlights: { h1: T2 } }),
    );
    expect(merged.highlights.h1).toBeUndefined();
    expect(merged.notes.a).toBeDefined();
  });

  it("produces a current-version notebook", () => {
    expect(mergeNotebooks(createEmptyNotebook(), createEmptyNotebook()).version).toBe(2);
  });
});

describe("mergeProgress", () => {
  function progress(partial: Partial<Progress>): Progress {
    return { ...createEmptyProgress(), ...partial };
  }

  it("keeps the furthest-along status for each concept", () => {
    const merged = mergeProgress(
      progress({ conceptStatus: { a: "confident", b: "unseen" } }),
      progress({ conceptStatus: { a: "learning", b: "learning" } }),
    );
    expect(merged.conceptStatus).toEqual({ a: "confident", b: "learning" });
  });

  it("unions concepts seen on only one device", () => {
    const merged = mergeProgress(
      progress({ conceptStatus: { a: "learning" } }),
      progress({ conceptStatus: { b: "confident" } }),
    );
    expect(merged.conceptStatus).toEqual({ a: "learning", b: "confident" });
  });

  it("takes the max misconception count, never the sum", () => {
    // Summing would double-count every session both devices already saw.
    const merged = mergeProgress(
      progress({ misconceptionHits: { m1: 3, m2: 1 } }),
      progress({ misconceptionHits: { m1: 5 } }),
    );
    expect(merged.misconceptionHits).toEqual({ m1: 5, m2: 1 });
  });

  it("is symmetric", () => {
    const a = progress({ conceptStatus: { x: "confident" }, misconceptionHits: { m: 2 } });
    const b = progress({ conceptStatus: { x: "learning" }, misconceptionHits: { m: 7 } });
    expect(mergeProgress(a, b)).toEqual(mergeProgress(b, a));
  });
});
