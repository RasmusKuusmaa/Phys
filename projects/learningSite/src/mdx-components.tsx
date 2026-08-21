import type { MDXComponents } from "mdx/types";

/**
 * Tailwind's preflight strips the default underline, so MDX-authored links
 * need it back explicitly — matches the `underline` convention used
 * elsewhere in the app (glossary table, ConceptLinkList).
 */
const components: MDXComponents = {
  a: (props) => <a {...props} className="underline decoration-dotted hover:decoration-solid" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
