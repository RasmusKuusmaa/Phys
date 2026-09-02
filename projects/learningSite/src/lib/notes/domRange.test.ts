// @vitest-environment happy-dom
//
// The only tests in the suite that need a DOM. Scoped to this file with a
// docblock rather than switched on globally, so every other test keeps
// starting in the faster node environment.
//
// happy-dom rather than jsdom: on this project jsdom took ~48s just to
// boot a worker, close enough to the pool's startup timeout that the run
// failed intermittently. happy-dom starts in a fraction of that and
// implements everything the painter touches (TreeWalker, Range,
// splitText, normalize).
import { describe, it, expect, beforeEach } from "vitest";
import { clearHighlights, offsetsForRange, paintHighlights } from "./domRange";
import { createAnchor, resolveAnchor } from "./anchor";

let root: HTMLElement;

/** Stands in for a rendered MDX explanation: several paragraphs with inline markup. */
function render(html: string): HTMLElement {
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById("root")!;
}

beforeEach(() => {
  root = render(
    "<p>The net force on a body equals its <em>mass</em> times its acceleration.</p>" +
      "<p>Without a net force the body keeps its velocity.</p>",
  );
});

function rangeOver(text: string): Range {
  // Build a range over `text` by locating it in a single text node.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const at = (node as Text).data.indexOf(text);
    if (at !== -1) {
      const range = document.createRange();
      range.setStart(node, at);
      range.setEnd(node, at + text.length);
      return range;
    }
  }
  throw new Error(`"${text}" not found`);
}

describe("offsetsForRange", () => {
  it("maps a range to offsets in the container's text", () => {
    const offsets = offsetsForRange(root, rangeOver("net force"))!;
    expect(root.textContent!.slice(offsets.start, offsets.end)).toBe("net force");
  });

  it("counts text inside nested elements", () => {
    // "acceleration" sits after an <em>, so its offset only lines up if the
    // walker counted the em's text too.
    const offsets = offsetsForRange(root, rangeOver("acceleration"))!;
    expect(root.textContent!.slice(offsets.start, offsets.end)).toBe("acceleration");
    expect(offsets.start).toBeGreaterThan(root.textContent!.indexOf("mass"));
  });

  it("returns null for a range outside the container", () => {
    const outside = document.createElement("p");
    outside.textContent = "elsewhere";
    document.body.appendChild(outside);
    const range = document.createRange();
    range.selectNodeContents(outside);
    expect(offsetsForRange(root, range)).toBeNull();
  });
});

describe("paintHighlights", () => {
  it("wraps exactly the requested text in a mark", () => {
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...offsetsOf("net force") }]);
    const marks = root.querySelectorAll("mark[data-highlight-id]");
    expect(marks).toHaveLength(1);
    expect(marks[0]!.textContent).toBe("net force");
    expect(marks[0]!.getAttribute("data-note-id")).toBe("n1");
  });

  it("leaves the container's text unchanged, so offsets stay valid", () => {
    const before = root.textContent;
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...offsetsOf("net force") }]);
    expect(root.textContent).toBe(before);
  });

  it("splits into several marks when a span crosses an element boundary", () => {
    // Runs from before the <em> to after it, so it lives in no single text
    // node — offsets have to come from the container text, not a node.
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...offsetsInText("its mass times") }]);
    const marks = root.querySelectorAll('mark[data-highlight-id="h1"]');
    expect(marks.length).toBeGreaterThan(1);
    expect([...marks].map((m) => m.textContent).join("")).toBe("its mass times");
  });

  it("paints several highlights without disturbing each other's offsets", () => {
    paintHighlights(root, [
      { id: "h1", noteId: "n1", ...offsetsOf("net force") },
      { id: "h2", noteId: "n2", ...offsetsOf("velocity") },
    ]);
    expect(root.querySelector('mark[data-highlight-id="h1"]')!.textContent).toBe("net force");
    expect(root.querySelector('mark[data-highlight-id="h2"]')!.textContent).toBe("velocity");
  });

  it("makes highlights keyboard-reachable", () => {
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...offsetsOf("net force") }]);
    const mark = root.querySelector("mark[data-highlight-id]")!;
    expect(mark.getAttribute("tabindex")).toBe("0");
    expect(mark.getAttribute("role")).toBe("button");
  });
});

describe("clearHighlights", () => {
  it("restores the container to its original markup", () => {
    const before = root.innerHTML;
    paintHighlights(root, [
      { id: "h1", noteId: "n1", ...offsetsOf("net force") },
      { id: "h2", noteId: "n2", ...offsetsOf("velocity") },
    ]);
    expect(root.innerHTML).not.toBe(before);

    clearHighlights(root);
    // Byte-for-byte identical — this is what lets React keep owning these
    // nodes: the painter always hands the DOM back exactly as it found it.
    expect(root.innerHTML).toBe(before);
  });

  it("re-merges split text nodes so repeated paint cycles don't fragment the tree", () => {
    for (let i = 0; i < 3; i++) {
      paintHighlights(root, [{ id: "h1", noteId: "n1", ...offsetsOf("net force") }]);
      clearHighlights(root);
    }
    const firstParagraph = root.querySelector("p")!;
    // "The net force on a body equals its " | <em> | " times its acceleration."
    const textChildren = [...firstParagraph.childNodes].filter((n) => n.nodeType === 3);
    expect(textChildren).toHaveLength(2);
  });
});

describe("anchor round-trip through the DOM", () => {
  it("selection -> anchor -> resolve -> paint lands on the original words", () => {
    const offsets = offsetsForRange(root, rangeOver("mass"))!;
    const text = root.textContent!;

    const anchor = createAnchor(text, offsets.start, offsets.end)!;
    const resolved = resolveAnchor(text, anchor)!;
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...resolved }]);

    expect(root.querySelector("mark[data-highlight-id]")!.textContent).toBe("mass");
  });

  it("re-anchors onto the same words after a paragraph is inserted above", () => {
    const anchor = createAnchor(root.textContent!, ...tupleOf(offsetsOf("velocity")))!;

    // Re-render with an extra paragraph first — every offset shifts.
    root = render(
      "<p>A brand new opening paragraph appears here.</p>" +
        "<p>The net force on a body equals its <em>mass</em> times its acceleration.</p>" +
        "<p>Without a net force the body keeps its velocity.</p>",
    );

    const resolved = resolveAnchor(root.textContent!, anchor)!;
    paintHighlights(root, [{ id: "h1", noteId: "n1", ...resolved }]);
    expect(root.querySelector("mark[data-highlight-id]")!.textContent).toBe("velocity");
  });
});

function offsetsOf(text: string): { start: number; end: number } {
  return offsetsForRange(root, rangeOver(text))!;
}

/** Offsets straight from the container text — for spans that cross element boundaries. */
function offsetsInText(text: string): { start: number; end: number } {
  const start = root.textContent!.indexOf(text);
  if (start === -1) throw new Error(`"${text}" not found in container text`);
  return { start, end: start + text.length };
}

function tupleOf(offsets: { start: number; end: number }): [number, number] {
  return [offsets.start, offsets.end];
}
