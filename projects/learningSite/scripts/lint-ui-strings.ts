import en from "@/i18n/messages/en.json";

/**
 * Estonian requires case inflection on interpolated nouns
 * ("Practise {concept}" can't be translated), so UI strings must never
 * contain a `{placeholder}` — write the full string per item instead, or
 * keep the label noun-free.
 */
function findInterpolations(node: unknown, path = ""): string[] {
  const found: string[] = [];
  if (typeof node === "string") {
    if (/\{[^}]+\}/.test(node)) found.push(`${path}: "${node}"`);
    return found;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      found.push(...findInterpolations(value, path ? `${path}.${key}` : key));
    }
  }
  return found;
}

function main() {
  const issues = findInterpolations(en);
  if (issues.length === 0) {
    console.log("UI strings lint OK: no interpolated placeholders found.");
    return;
  }
  console.error(`UI strings lint failed: ${issues.length} interpolated string(s)\n`);
  for (const issue of issues) console.error(`  ${issue}`);
  process.exitCode = 1;
}

main();
