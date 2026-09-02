import { describe, it, expect } from "vitest";
import { mergeNotebooks, mergeProgress, mergeJournal, mergeTestHistory } from "./merge";
import { createEmptyNotebook, type Note, type Notebook } from "@/lib/notes/schema";
import { createEmptyProgress, type Progress } from "@/lib/progress/schema";
import { createEmptyJournal, type StudySession, type Journal } from "@/lib/journal/schema";
import { createEmptyTestHistory, type TestAttempt, type TestHistory } from "@/lib/testHistory/schema";

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

describe("mergeJournal", () => {
  function session(id: string, updatedAt: string, minutes = 20): StudySession {
    return {
      id,
      conceptId: "kinematics-in-one-dimension",
      date: "2026-09-01",
      minutes,
      understanding: 3,
      note: "",
      createdAt: T1,
      updatedAt,
    };
  }

  function journal(partial: Partial<Journal>): Journal {
    return { ...createEmptyJournal(), ...partial };
  }

  it("keeps sessions that exist on only one side", () => {
    const merged = mergeJournal(
      journal({ sessions: { a: session("a", T1) } }),
      journal({ sessions: { b: session("b", T1) } }),
    );
    expect(Object.keys(merged.sessions).sort()).toEqual(["a", "b"]);
  });

  it("takes the more recently edited copy of a session edited on both devices", () => {
    const merged = mergeJournal(
      journal({ sessions: { a: session("a", T1, 10) } }),
      journal({ sessions: { a: session("a", T2, 40) } }),
    );
    expect(merged.sessions.a!.minutes).toBe(40);
  });

  it("does not resurrect a session deleted on the other device", () => {
    // Same reasoning as notes: local still has it, remote deleted it later.
    const merged = mergeJournal(
      journal({ sessions: { a: session("a", T1) } }),
      journal({ deletedSessions: { a: T2 } }),
    );
    expect(merged.sessions.a).toBeUndefined();
    expect(merged.deletedSessions.a).toBe(T2);
  });

  it("brings a session back when it was edited after the deletion", () => {
    const merged = mergeJournal(
      journal({ sessions: { a: session("a", T3) } }),
      journal({ deletedSessions: { a: T2 } }),
    );
    expect(merged.sessions.a).toBeDefined();
  });

  it("merges reflections by updatedAt, one per date with no tombstone to fight", () => {
    const merged = mergeJournal(
      journal({ days: { "2026-09-01": { date: "2026-09-01", reflection: "Older", updatedAt: T1 } } }),
      journal({ days: { "2026-09-01": { date: "2026-09-01", reflection: "Newer", updatedAt: T2 } } }),
    );
    expect(merged.days["2026-09-01"]!.reflection).toBe("Newer");
  });

  it("is symmetric", () => {
    const left = journal({ sessions: { a: session("a", T1), c: session("c", T1) } });
    const right = journal({ sessions: { a: session("a", T2) }, deletedSessions: { c: T3 } });
    const ab = mergeJournal(left, right);
    const ba = mergeJournal(right, left);
    expect(Object.keys(ab.sessions).sort()).toEqual(Object.keys(ba.sessions).sort());
  });

  it("produces a current-version journal", () => {
    expect(mergeJournal(createEmptyJournal(), createEmptyJournal()).version).toBe(1);
  });
});

describe("mergeTestHistory", () => {
  function attempt(id: string, takenAt: string, percent = 80): TestAttempt {
    return { id, conceptIds: ["kinematics-in-one-dimension"], percent, itemCount: 5, takenAt };
  }

  function history(partial: Partial<TestHistory>): TestHistory {
    return { ...createEmptyTestHistory(), ...partial };
  }

  it("unions attempts taken on only one device", () => {
    const merged = mergeTestHistory(
      history({ attempts: { a: attempt("a", T1) } }),
      history({ attempts: { b: attempt("b", T2) } }),
    );
    expect(Object.keys(merged.attempts).sort()).toEqual(["a", "b"]);
  });

  it("keeps every attempt from a one-sided history untouched", () => {
    const merged = mergeTestHistory(history({ attempts: { a: attempt("a", T1), b: attempt("b", T2) } }), history({}));
    expect(merged.attempts).toEqual({ a: attempt("a", T1), b: attempt("b", T2) });
  });

  it("is symmetric", () => {
    const left = history({ attempts: { a: attempt("a", T1) } });
    const right = history({ attempts: { b: attempt("b", T2) } });
    expect(mergeTestHistory(left, right)).toEqual(mergeTestHistory(right, left));
  });

  it("produces a current-version history", () => {
    expect(mergeTestHistory(createEmptyTestHistory(), createEmptyTestHistory()).version).toBe(1);
  });
});
