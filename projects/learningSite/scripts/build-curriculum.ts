import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { CONTENT_ROOT } from "@/content/loader";
import { COURSE_NAMES_EN, MODULE_NAMES_EN, UNCODED_COURSE_HEADERS } from "@/curriculum/translations";
import type { Course, Module, Track } from "@/curriculum/types";

/**
 * Parses `content/actual_ut_course/` (raw scraped ÕIS text, never modified) into
 * the structured dataset under `content/curriculum/`.
 *
 * Run with `npm run curriculum:build`. The raw text is the source of truth: if
 * a course looks wrong here, fix the parser, don't hand-edit the output — every
 * generated file is overwritten on the next run.
 */

const RAW_ROOT = `${CONTENT_ROOT}/actual_ut_course`;
const OUT_ROOT = `${CONTENT_ROOT}/curriculum`;

const COURSE_HEADER = /^(.+?)\s*\((\d+)\s*EAP\)\s*([A-Z]{4}\.\d{2}\.\d{3})\s*$/;
const UNCODED_HEADER = /^(.+?)\s*\((\d+)\s*EAP\)\s*$/;
const MODULE_HEADER = /^(\d+\.\d+)\s+(.+?)(?:\s*\|\s*(.+))?$/;
const GROUP_HEADER = /^(\d+)\.\s+(\S.*)$/;
const COURSE_BULLET = /^●\s*(.+?)\s*∙\s*([A-Z]{4}\.\d{2}\.\d{3})\s*$/;
const NUMBERED_TOPIC = /^(\d{1,2})\.\s+(.+?)\s*(?:\(([^)]*)\))?\s*$/;
const SESSION_ROW = /^(\d{2}\.\d{2}\.\d{4})?\s*\t?.*\b(loeng|seminar|e-õpe|praktikum|kontrolltöö|eksam)\b/i;
const COURSE_CODE = /^[A-Z]{4}\.\d{2}\.\d{3}$/;

const readLines = (path: string) => readFileSync(path, "utf8").split(/\r?\n/);

function section(lines: string[], start: string, ends: string[]): string[] {
  const from = lines.findIndex((l) => l.trim() === start);
  if (from === -1) return [];
  const rest = lines.slice(from + 1);
  const to = rest.findIndex((l) => ends.includes(l.trim()));
  return (to === -1 ? rest : rest.slice(0, to)).map((l) => l.trim()).filter(Boolean);
}

/** Course codes listed under a course's own "Eeldusained" block. */
function prerequisiteCodes(lines: string[]): string[] {
  const found = new Set<string>();
  const block = section(lines, "Eeldusained", [
    "Õppeaine on eeldusaineks järgmistele õppeainetele",
    "Õppeaine kuuluvus",
    "Üldinfo",
  ]);
  for (const line of block) if (COURSE_CODE.test(line)) found.add(line);
  return [...found];
}

/**
 * Two schedule layouts appear in the raw text and both carry the syllabus:
 *   A) numbered headings — `7. Elektromagnetväli (8 h)` with a keyword paragraph under it
 *   B) session rows — `11.02.2026 <tab> 1 <tab> loeng 1` with the topic on the next line
 */
function extractTopics(lines: string[]): Course["topics"] {
  const at = lines.findIndex((l) => l.trim() === "Ajakava");
  const body = at === -1 ? [] : lines.slice(at + 1);

  const numbered: Course["topics"] = [];
  for (let i = 0; i < body.length; i++) {
    const m = NUMBERED_TOPIC.exec(body[i].trim());
    // Topics run 1..N in order; requiring the sequence to continue keeps
    // numbered outcome lists and stray dates out of the topic list.
    if (!m || Number(m[1]) !== numbered.length + 1) continue;
    const keywords: string[] = [];
    for (let j = i + 1; j < body.length && keywords.length < 3; j++) {
      const t = body[j].trim();
      if (!t) continue;
      const next = NUMBERED_TOPIC.exec(t);
      if (next && Number(next[1]) === numbered.length + 2) break;
      if (SESSION_ROW.test(t) || /^(Kuupäev|Õppe toimumisnädalad|Loengud|Seminarid)/.test(t)) continue;
      keywords.push(t);
    }
    numbered.push({ title: m[2].trim(), hours: m[3] ?? null, keywords: keywords.join(" ") });
  }
  if (numbered.length >= 3) return numbered;

  const sessions: Course["topics"] = [];
  for (let i = 0; i < body.length; i++) {
    if (!SESSION_ROW.test(body[i])) continue;
    for (let j = i + 1; j < body.length; j++) {
      const t = body[j].trim();
      if (!t) continue;
      if (SESSION_ROW.test(t)) break;
      // Trailing " - S. Lange" is the lecturer, not part of the topic.
      sessions.push({ title: t.replace(/\s*[-–]\s*[A-ZÜÕÄÖ]\.\s*\S+\s*$/, "").trim(), hours: null, keywords: "" });
      break;
    }
  }
  return sessions;
}

type ParsedCourse = Omit<Course, "name" | "modules" | "status" | "conceptIds" | "hasSyllabus"> & {
  nameEt: string;
};

function parseCourseFiles(): Map<string, ParsedCourse> {
  const byCode = new Map<string, ParsedCourse>();

  for (const dir of readdirSync(RAW_ROOT)) {
    for (const file of readdirSync(`${RAW_ROOT}/${dir}`)) {
      if (!file.endsWith(".md") || file === "base.md") continue;
      const rel = `${dir}/${file}`;
      const lines = readLines(`${RAW_ROOT}/${rel}`);

      // Locate every course header, coded or not. Uncoded headers appear only in
      // the AlusMoodulid pages and are resolved to codes by an explicit table.
      const starts: { i: number; nameEt: string; eap: number | null; code: string }[] = [];
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        const coded = COURSE_HEADER.exec(trimmed);
        if (coded) {
          starts.push({ i, nameEt: coded[1].trim(), eap: Number(coded[2]), code: coded[3] });
          return;
        }
        // The table is keyed by line number and wins outright, so headings the
        // patterns can't parse at all (e.g. "füüsikaline maailmapilt 6eap")
        // are still picked up.
        const keyed = UNCODED_COURSE_HEADERS[`${rel}:${i + 1}`];
        if (!keyed) return;
        const uncoded = UNCODED_HEADER.exec(trimmed);
        const loose = /(\d+)\s*eap/i.exec(trimmed);
        starts.push({
          i,
          nameEt: (uncoded?.[1] ?? trimmed.replace(/\s*\(?\d+\s*eap\)?\s*$/i, "")).trim(),
          eap: uncoded ? Number(uncoded[2]) : loose ? Number(loose[1]) : null,
          code: keyed,
        });
      });

      starts.forEach((s, k) => {
        const body = lines.slice(s.i + 1, k + 1 < starts.length ? starts[k + 1].i : lines.length);
        const parsed: ParsedCourse = {
          code: s.code,
          nameEt: s.nameEt,
          eap: s.eap,
          prerequisiteCodes: prerequisiteCodes(body),
          aims: section(body, "Eesmärgid", ["Õpiväljundid"]).join(" "),
          outcomes: section(body, "Õpiväljundid", ["Sisu lühikirjeldus", "Muu info", "Sihtrühm", "Hindamine"]).filter(
            (l) => !/^(Aine|Mooduli|Praktikumi|Kursuse|Õppeaine) (läbinud|sooritanud) (üliõpilane|õppija):?$/.test(l),
          ),
          summary: section(body, "Sisu lühikirjeldus", ["Muu info", "Sihtrühm", "Hindamine"]).join(" "),
          topics: extractTopics(body),
          sourceFiles: [rel],
        };

        // A course listed in several modules is scraped once per module page.
        // Keep the richest parse of each field rather than the first seen.
        const prev = byCode.get(s.code);
        if (!prev) {
          byCode.set(s.code, parsed);
          return;
        }
        prev.sourceFiles.push(rel);
        if (parsed.topics.length > prev.topics.length) prev.topics = parsed.topics;
        if (parsed.outcomes.length > prev.outcomes.length) prev.outcomes = parsed.outcomes;
        if (parsed.summary.length > prev.summary.length) prev.summary = parsed.summary;
        if (parsed.aims.length > prev.aims.length) prev.aims = parsed.aims;
        if (parsed.prerequisiteCodes.length > prev.prerequisiteCodes.length) {
          prev.prerequisiteCodes = parsed.prerequisiteCodes;
        }
      });
    }
  }
  return byCode;
}

/** Which track a module belongs to, and whether it is required, from its heading. */
function classifyModule(number: string, nameEt: string, requirementEt: string | null) {
  const group = number.split(".")[0];
  const minor = /kõrvaleriala/i.test(nameEt);
  const track: Track | "all" | null = /füüsika/i.test(nameEt)
    ? "physics"
    : /keemia/i.test(nameEt)
      ? "chemistry"
      : /materjaliteadus/i.test(nameEt)
        ? "materials-science"
        : group === "1"
          ? "all"
          : null;

  const req = (requirementEt ?? "").toLowerCase();
  const requirement: Module["requirement"] = minor
    ? "minor-only"
    : group === "1"
      ? "mandatory"
      : req.includes("kohustuslik")
        ? "mandatory"
        : "elective";

  return { track, requirement, minor };
}

/** Estonian course names taken from the module bullet lists in every base.md. */
const bulletNames = new Map<string, string>();
const bulletEap = new Map<string, number>();

function parseModules(): Module[] {
  const modules: Module[] = [];

  for (const dir of readdirSync(RAW_ROOT)) {
    const lines = readLines(`${RAW_ROOT}/${dir}/base.md`);
    let groupName = dir;
    const first = GROUP_HEADER.exec(lines[0]?.trim() ?? "");
    if (first) groupName = first[2].trim();

    let current: Module | null = null;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const head = MODULE_HEADER.exec(trimmed);
      if (head && !COURSE_BULLET.test(trimmed)) {
        const [, number, nameEt, requirementEt] = head;
        const eapLine = lines[i + 1]?.trim() ?? "";
        const eap = /^(\d+)\s*EAP$/.exec(eapLine);
        const { track, requirement, minor } = classifyModule(number, nameEt, requirementEt ?? null);
        current = {
          number,
          group: groupName,
          name: { et: nameEt.trim(), en: MODULE_NAMES_EN[number] ?? nameEt.trim() },
          requirementEt: (requirementEt ?? "").trim() || null,
          requirement,
          track,
          minorOnly: minor,
          eap: eap ? Number(eap[1]) : null,
          courseCodes: [],
        };
        modules.push(current);
        continue;
      }
      const bullet = COURSE_BULLET.exec(trimmed);
      if (!bullet) continue;
      bulletNames.set(bullet[2], bullet[1].trim());
      const eapLine = /^(\d+)\s*EAP$/.exec(lines[i + 1]?.trim() ?? "");
      if (eapLine) bulletEap.set(bullet[2], Number(eapLine[1]));
      if (current && !current.courseCodes.includes(bullet[2])) current.courseCodes.push(bullet[2]);
    }
  }
  return modules;
}

/**
 * A course's standing differs per track, so it is recorded per track rather
 * than as one label: required in one degree, a free elective in another, and
 * absent from the third is the normal case.
 */
function statusFor(track: Track, modules: Module[]): Course["status"][Track] {
  const relevant = modules.filter((m) => m.track === track || m.track === "all");
  if (!relevant.length) return "not-in-track";
  if (relevant.some((m) => m.requirement === "mandatory" && !m.minorOnly)) {
    return relevant.some((m) => m.track === "all") ? "mandatory-all" : "mandatory";
  }
  if (relevant.some((m) => m.requirement === "elective" && !m.minorOnly)) return "elective";
  return "minor-only";
}

function main() {
  const parsed = parseCourseFiles();
  const modules = parseModules();

  const modulesByCode = new Map<string, Module[]>();
  for (const m of modules) {
    for (const code of m.courseCodes) {
      if (!modulesByCode.has(code)) modulesByCode.set(code, []);
      modulesByCode.get(code)!.push(m);
    }
  }

  const allCodes = new Set([...parsed.keys(), ...modulesByCode.keys()]);
  const courses: Course[] = [];

  for (const code of [...allCodes].sort()) {
    const p = parsed.get(code);
    const inModules = modulesByCode.get(code) ?? [];
    // A course with no syllabus page still has a name and credit weight in the
    // module bullet list, which is enough to show it as a known gap.
    const nameEt = p?.nameEt ?? bulletNames.get(code) ?? code;
    const eapFromModule = inModules.length ? bulletEap.get(code) ?? null : null;

    courses.push({
      code,
      name: { et: nameEt, en: COURSE_NAMES_EN[code] ?? nameEt },
      eap: p?.eap ?? eapFromModule,
      modules: inModules.map((m) => m.number).sort(),
      status: {
        physics: statusFor("physics", inModules),
        chemistry: statusFor("chemistry", inModules),
        "materials-science": statusFor("materials-science", inModules),
      },
      prerequisiteCodes: p?.prerequisiteCodes ?? [],
      aims: p?.aims ?? "",
      outcomes: p?.outcomes ?? [],
      summary: p?.summary ?? "",
      topics: p?.topics ?? [],
      // Filled in by the mapping pass, not by the parser — see curriculum/mapping.
      conceptIds: [],
      sourceFiles: p?.sourceFiles ?? [],
      hasSyllabus: Boolean(p),
    });
  }

  mkdirSync(`${OUT_ROOT}/courses`, { recursive: true });
  writeFileSync(`${OUT_ROOT}/modules.json`, `${JSON.stringify(modules, null, 2)}\n`, "utf8");
  for (const course of courses) {
    writeFileSync(`${OUT_ROOT}/courses/${course.code}.json`, `${JSON.stringify(course, null, 2)}\n`, "utf8");
  }

  const withSyllabus = courses.filter((c) => c.hasSyllabus).length;
  const topics = courses.reduce((n, c) => n + c.topics.length, 0);
  console.log(
    `Curriculum built: ${modules.length} module(s), ${courses.length} course(s) ` +
      `(${withSyllabus} with a scraped syllabus), ${topics} topic(s).`,
  );
  for (const track of ["physics", "chemistry", "materials-science"] as const) {
    const counts = courses.reduce<Record<string, number>>((acc, c) => {
      acc[c.status[track]] = (acc[c.status[track]] ?? 0) + 1;
      return acc;
    }, {});
    console.log(`  ${track.padEnd(18)} ${JSON.stringify(counts)}`);
  }
}

main();
