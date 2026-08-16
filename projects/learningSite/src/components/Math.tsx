import katex from "katex";

type MathProps = {
  tex: string;
  display?: boolean;
  className?: string;
};

/**
 * Renders LaTeX to HTML on the server with KaTeX, so no client-side math
 * library ships to the browser. `tex` must be trusted content (glossary /
 * formula schema strings, never raw user input) since KaTeX output is
 * injected as HTML.
 */
export function Math({ tex, display = false, className }: MathProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    output: "htmlAndMathml",
  });

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
