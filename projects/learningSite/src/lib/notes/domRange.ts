/**
 * The bridge between the browser's DOM selection model and the flat
 * character offsets `anchor.ts` reasons about.
 *
 * Everything here is deliberately thin: the interesting logic (which
 * occurrence of a quote is the right one) lives in `anchor.ts` as pure
 * string functions with real unit tests, because the test runner has no
 * DOM. What's left is mechanical tree walking, verified in the browser.
 */

export const MARK_ATTR = "data-highlight-id";
export const MARK_NOTE_ATTR = "data-note-id";

/** Text nodes under `root`, in document order — the same order that makes up `root.textContent`. */
function textNodesIn(root: Element): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    nodes.push(node as Text);
  }
  return nodes;
}

/**
 * Character offsets of `range` within `root`'s text, or null if the range
 * isn't fully inside `root` (a selection dragged out of the prose).
 */
export function offsetsForRange(
  root: Element,
  range: Range,
): { start: number; end: number } | null {
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;

  let offset = 0;
  let start: number | null = null;
  let end: number | null = null;

  for (const node of textNodesIn(root)) {
    if (node === range.startContainer) start = offset + range.startOffset;
    if (node === range.endContainer) end = offset + range.endOffset;
    offset += node.data.length;
  }

  // A selection anchored on an element rather than a text node (e.g. a
  // triple-click that grabs a whole paragraph) reports container nodes we
  // never visit above; fall back to the range's own text length.
  if (start === null || end === null) return null;
  return start <= end ? { start, end } : { start: end, end: start };
}

type PaintSpan = { id: string; noteId: string; start: number; end: number };

/**
 * Wraps each span in a `<mark>`, splitting text nodes as needed so a span
 * crossing an element boundary becomes several marks sharing one id.
 *
 * Spans must be non-overlapping (run them through `dropOverlaps` first).
 * Painting proceeds back-to-front so each split leaves the offsets of the
 * spans still to be painted untouched.
 */
export function paintHighlights(root: Element, spans: PaintSpan[]): void {
  const ordered = [...spans].sort((a, b) => b.start - a.start);
  for (const span of ordered) {
    for (const piece of piecesFor(root, span.start, span.end).reverse()) {
      const mark = document.createElement("mark");
      mark.setAttribute(MARK_ATTR, span.id);
      mark.setAttribute(MARK_NOTE_ATTR, span.noteId);
      mark.className = "note-highlight";
      // tabindex + role so a highlight is reachable and activatable by
      // keyboard, not just by pointer.
      mark.setAttribute("tabindex", "0");
      mark.setAttribute("role", "button");
      piece.replaceWith(mark);
      mark.appendChild(piece);
    }
  }
}

/**
 * Splits text nodes so that exactly the text in `[start, end)` is covered
 * by whole text nodes, and returns them.
 */
function piecesFor(root: Element, start: number, end: number): Text[] {
  const pieces: Text[] = [];
  let offset = 0;

  for (const node of textNodesIn(root)) {
    const nodeStart = offset;
    const nodeEnd = offset + node.data.length;
    offset = nodeEnd;

    if (nodeEnd <= start || nodeStart >= end) continue;

    let piece = node;
    // Trim the tail first: splitText returns the remainder, and doing the
    // head first would shift the offsets this calculation is based on.
    if (nodeEnd > end) piece.splitText(end - nodeStart);
    if (nodeStart < start) piece = piece.splitText(start - nodeStart);
    pieces.push(piece);
  }

  return pieces;
}

/**
 * Unwraps every mark this module painted and re-merges the text nodes that
 * painting split.
 *
 * `normalize()` is scoped to just those parents rather than called on the
 * whole root: merging is only ever meant to undo `piecesFor`'s splits, and
 * a blanket normalize could also fuse two text nodes React rendered as
 * separate siblings — nodes React still expects to find on their own.
 */
export function clearHighlights(root: Element): void {
  const touched = new Set<Node>();
  for (const mark of Array.from(root.querySelectorAll(`mark[${MARK_ATTR}]`))) {
    if (mark.parentNode) touched.add(mark.parentNode);
    mark.replaceWith(...Array.from(mark.childNodes));
  }
  for (const parent of touched) parent.normalize();
}
