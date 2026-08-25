import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { CONTENT_ROOT } from "@/content/loader";
import { hashSource } from "@/schema/hash";
import { MIN_MISCONCEPTIONS_PER_CONCEPT } from "@/content/checks/coverage";
import { locales } from "@/i18n/locales";

/**
 * Scaffolds every file a concept needs, all at once, so the "author the
 * concept now, add its misconceptions/items/resources later" path — the one
 * that shipped 29 half-finished concepts in Phase 11b — doesn't exist.
 *
 *   npm run content:new-concept -- --subject physics --id quantum-tunneling \
 *     --level L3 --module quantum-mechanics --prerequisites wavefunctions-and-probability
 *
 * Placeholders are written in BOTH locales and are deliberately obvious
 * (`TODO(en)` / `TODO(et)`); fill them in before committing. Placeholder text
 * is real text as far as the schema is concerned, so this scaffolds a
 * *validating* concept, not a passing-but-empty one — the terminology linter
 * and a human reading the page are the backstop against shipping TODOs.
 */

type Args = Record<string, string>;

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    args[key] = next && !next.startsWith("--") ? next : "true";
    if (args[key] !== "true") i++;
  }
  return args;
}

function localised(en: string, et: string) {
  return { en, et, sourceHash: hashSource(en), stale: false };
}

function write(filePath: string, data: unknown, created: string[], skipped: string[]) {
  if (existsSync(filePath)) {
    skipped.push(filePath);
    return;
  }
  mkdirSync(filePath.slice(0, filePath.lastIndexOf("/")), { recursive: true });
  const body =
    typeof data === "string" ? data : `${JSON.stringify(data, null, 2)}\n`;
  writeFileSync(filePath, body, "utf8");
  created.push(filePath);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const subject = args.subject ?? "physics";
  const id = args.id;
  const level = args.level ?? "L2";
  const moduleName = args.module;

  if (!id || !moduleName) {
    console.error(
      "usage: npm run content:new-concept -- --id <concept-id> --module <module> [--subject physics] [--level L0|L1|L2|L3] [--prerequisites a,b]",
    );
    process.exitCode = 1;
    return;
  }

  const root = `${CONTENT_ROOT}/${subject}`;
  if (existsSync(`${root}/concepts/${id}.json`)) {
    console.error(`concept "${id}" already exists in ${subject} — nothing scaffolded.`);
    process.exitCode = 1;
    return;
  }

  const knownConcepts = new Set(
    (existsSync(`${root}/concepts`) ? readdirSync(`${root}/concepts`) : []).map((f) =>
      f.replace(/\.json$/, ""),
    ),
  );
  const prerequisites = (args.prerequisites ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const unknown = prerequisites.filter((p) => !knownConcepts.has(p));
  if (unknown.length) {
    console.error(`unknown prerequisite(s): ${unknown.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const created: string[] = [];
  const skipped: string[] = [];

  write(
    `${root}/concepts/${id}.json`,
    {
      id,
      subject,
      level,
      module: moduleName,
      title: localised(`TODO(en) title for ${id}`, `TODO(et) pealkiri: ${id}`),
      summary: localised(
        `TODO(en) one-paragraph summary for ${id}.`,
        `TODO(et) ühelõiguline kokkuvõte: ${id}.`,
      ),
      prerequisites,
    },
    created,
    skipped,
  );

  for (let i = 1; i <= MIN_MISCONCEPTIONS_PER_CONCEPT; i++) {
    write(
      `${root}/misconceptions/${id}-m${i}.json`,
      {
        id: `${id}-m${i}`,
        conceptId: id,
        text: localised(
          `TODO(en) misconception ${i} — state the wrong belief as a learner would hold it.`,
          `TODO(et) väärarusaam ${i} — sõnasta ekslik arusaam nii, nagu õppija seda usub.`,
        ),
      },
      created,
      skipped,
    );
  }

  write(
    `${root}/concept-items/${id}-item1.json`,
    {
      id: `${id}-item1`,
      conceptId: id,
      type: "multiple-choice",
      stem: localised(`TODO(en) question stem for ${id}?`, `TODO(et) küsimus: ${id}?`),
      options: [
        {
          id: "a",
          label: localised("TODO(en) correct option", "TODO(et) õige vastus"),
          correct: true,
        },
        {
          id: "b",
          label: localised("TODO(en) wrong option", "TODO(et) vale vastus"),
          correct: false,
          misconceptionId: `${id}-m1`,
        },
        {
          id: "c",
          label: localised("TODO(en) wrong option", "TODO(et) vale vastus"),
          correct: false,
          misconceptionId: `${id}-m2`,
        },
        {
          id: "d",
          label: localised("TODO(en) wrong option", "TODO(et) vale vastus"),
          correct: false,
          misconceptionId: `${id}-m3`,
        },
      ],
    },
    created,
    skipped,
  );

  // Resources are curated per locale, never translated — the scaffold only
  // reserves one slot per locale, with a URL that fails the link checker
  // until it's replaced with a real, verified one.
  for (const locale of locales) {
    write(
      `${root}/resources/${id}-${locale}-todo.json`,
      {
        id: `${id}-${locale}-todo`,
        conceptId: id,
        locale,
        type: "article",
        title: `TODO(${locale}) curate a real resource and delete this file`,
        url: "https://example.invalid/replace-me",
      },
      created,
      skipped,
    );
  }

  for (const locale of locales) {
    write(
      `${root}/explanations/${id}-${locale}.mdx`,
      `TODO(${locale}): 2–3 short paragraphs building intuition beyond the summary.\n`,
      created,
      skipped,
    );
  }

  for (const filePath of created) console.log(`created  ${filePath.replace(`${process.cwd()}/`, "")}`);
  for (const filePath of skipped) console.log(`exists   ${filePath.replace(`${process.cwd()}/`, "")}`);
  console.log(
    `\nScaffolded "${id}". Replace every TODO (both locales), curate real resource URLs,` +
      `\nadd a formula + problem template + error model if the concept is quantitative, then run:` +
      `\n  npm run validate:content && npm run lint:terminology && npm run check:links`,
  );
}

main();
