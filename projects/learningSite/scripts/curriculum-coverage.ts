import { readdirSync, readFileSync } from "node:fs";
import { CONTENT_ROOT, listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { mappedConceptIds } from "@/curriculum/mapping";
import { TRACKS, type Course, type CourseStatus, type Module, type Track } from "@/curriculum/types";

/**
 * How much of each degree the site can currently teach.
 *
 * Answers the question the project exists to answer — "could someone obtain
 * this degree's knowledge here without showing up?" — by comparing what each
 * track requires against what is authored. Always exits 0: it reports.
 *
 *   npm run curriculum:coverage                 all three tracks, module by module
 *   npm run curriculum:coverage -- --track physics
 *   npm run curriculum:coverage -- --gaps       only what is missing
 *   npm run curriculum:coverage -- --extra      only content beyond the degree
 */

const CURRICULUM = `${CONTENT_ROOT}/curriculum`;

const load = <T,>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;

function loadCourses(): Course[] {
  return readdirSync(`${CURRICULUM}/courses`)
    .filter((f) => f.endsWith(".json"))
    .map((f) => load<Course>(`${CURRICULUM}/courses/${f}`))
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** Required means "you cannot finish this track without it". */
function isRequired(status: CourseStatus): boolean {
  return status === "mandatory-all" || status === "mandatory";
}

function statusLabel(status: CourseStatus): string {
  return {
    "mandatory-all": "required (all tracks)",
    mandatory: "required",
    elective: "elective",
    "minor-only": "minor only",
    "not-in-track": "not in track",
  }[status];
}

function bar(fraction: number, width = 18): string {
  const filled = Math.round(fraction * width);
  return `${"█".repeat(filled)}${"░".repeat(width - filled)}`;
}

function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--track") ? (args[args.indexOf("--track") + 1] as Track) : null;
  const gapsOnly = args.includes("--gaps");
  const extraOnly = args.includes("--extra");

  const courses = loadCourses();
  const modules = load<Module[]>(`${CURRICULUM}/modules.json`);
  const modulesByNumber = new Map(modules.map((m) => [m.number, m]));

  const conceptIds = new Set(listSubjects().flatMap((s) => loadConcepts(s).map((c) => c.id)));
  const mapped = mappedConceptIds();

  // A concept named by the mapping but absent from the content is a broken
  // join — it would silently inflate every coverage number below.
  const dangling = [...mapped].filter((id) => !conceptIds.has(id));
  if (dangling.length) {
    console.error(`\n${dangling.length} mapped concept id(s) do not exist:\n  ${dangling.join("\n  ")}\n`);
  }

  if (!extraOnly) {
    for (const track of TRACKS) {
      if (only && track !== only) continue;

      const inTrack = courses.filter((c) => c.status[track] !== "not-in-track");
      const required = inTrack.filter((c) => isRequired(c.status[track]));
      const coveredRequired = required.filter((c) => c.conceptIds.length > 0);
      const requiredEap = required.reduce((n, c) => n + (c.eap ?? 0), 0);
      const coveredEap = coveredRequired.reduce((n, c) => n + (c.eap ?? 0), 0);

      console.log(`\n${"=".repeat(78)}`);
      console.log(`  ${track.toUpperCase()}`);
      console.log("=".repeat(78));
      console.log(
        `  required courses covered: ${coveredRequired.length}/${required.length}   ` +
          `${bar(required.length ? coveredRequired.length / required.length : 0)}`,
      );
      console.log(
        `  required ECTS covered:    ${coveredEap}/${requiredEap} EAP        ` +
          `${bar(requiredEap ? coveredEap / requiredEap : 0)}`,
      );

      const byModule = new Map<string, Course[]>();
      for (const course of inTrack) {
        for (const number of course.modules) {
          const parentModule = modulesByNumber.get(number);
          if (!parentModule || (parentModule.track !== track && parentModule.track !== "all")) continue;
          if (!byModule.has(number)) byModule.set(number, []);
          byModule.get(number)!.push(course);
        }
      }

      for (const number of [...byModule.keys()].sort()) {
        const parentModule = modulesByNumber.get(number)!;
        const list = byModule.get(number)!;
        if (parentModule.minorOnly) continue;
        const shown = gapsOnly ? list.filter((c) => c.conceptIds.length === 0) : list;
        if (!shown.length) continue;

        console.log(`\n  ${number}  ${parentModule.name.en}  —  ${parentModule.requirement}, ${parentModule.eap ?? "?"} EAP`);
        for (const course of shown.sort((a, b) => a.code.localeCompare(b.code))) {
          const n = course.conceptIds.length;
          const mark = n === 0 ? "  none" : `${String(n).padStart(3)} cpt`;
          const req = isRequired(course.status[track]) ? "*" : " ";
          const syllabus = course.hasSyllabus ? `${String(course.topics.length).padStart(2)}t` : " --";
          console.log(
            `   ${req} ${mark}  ${syllabus}  ${course.code}  ${String(course.eap ?? "?").padStart(2)} EAP  ` +
              `${course.name.en}  [${statusLabel(course.status[track])}]`,
          );
        }
      }
    }
    console.log("\n  * = required for the track. 'cpt' = platform concepts mapped to the course.");
    console.log("  't' = syllabus topics parsed from the university's own course page; '--' = no syllabus captured.");
  }

  if (!gapsOnly) {
    const extra = [...conceptIds].filter((id) => !mapped.has(id)).sort();
    console.log(`\n${"=".repeat(78)}`);
    console.log(`  ENRICHMENT — ${extra.length} concept(s) taught here but not part of any course`);
    console.log("=".repeat(78));
    if (extra.length === 0) console.log("  (none — every concept maps to at least one course)");
    for (const id of extra) console.log(`  ${id}`);
  }

  const totalRequired = TRACKS.flatMap((t) => courses.filter((c) => isRequired(c.status[t])).map((c) => `${t}:${c.code}`));
  const totalCovered = TRACKS.flatMap((t) =>
    courses.filter((c) => isRequired(c.status[t]) && c.conceptIds.length > 0).map((c) => `${t}:${c.code}`),
  );
  console.log(
    `\nAcross all three tracks: ${totalCovered.length}/${totalRequired.length} required course-slots have content.\n`,
  );
}

main();
