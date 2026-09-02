import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { loadCourses, loadModules, isPracticalCourse } from "@/curriculum/loader";
import { TRACKS, type Course, type CourseStatus, type Module, type Track } from "@/curriculum/types";
import { loadAllConcepts } from "@/content/concepts";
import { CourseRow } from "./CourseRow";

function isRequired(status: CourseStatus): boolean {
  return status === "mandatory-all" || status === "mandatory";
}

export default async function CurriculumPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();

  const { track: trackParam } = await searchParams;
  const track: Track =
    trackParam && (TRACKS as readonly string[]).includes(trackParam) ? (trackParam as Track) : "physics";

  const courses = loadCourses();
  const modules = loadModules();
  const modulesByNumber = new Map(modules.map((m) => [m.number, m]));

  const inTrack = courses.filter((c) => c.status[track] !== "not-in-track");
  const required = inTrack.filter((c) => isRequired(c.status[track]));
  const coveredRequired = required.filter((c) => c.conceptIds.length > 0);

  const byModule = new Map<string, Course[]>();
  for (const course of inTrack) {
    for (const number of course.modules) {
      const parentModule = modulesByNumber.get(number);
      if (!parentModule || (parentModule.track !== track && parentModule.track !== "all")) continue;
      if (parentModule.minorOnly) continue;
      if (!byModule.has(number)) byModule.set(number, []);
      byModule.get(number)!.push(course);
    }
  }

  const moduleNumbers = [...byModule.keys()].sort();
  const conceptById = new Map(loadAllConcepts().map((c) => [c.id, c]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-16">
      <h1 className="text-3xl font-semibold">{dict.curriculum.heading}</h1>
      <p className="mt-4 text-muted">{dict.curriculum.intro}</p>

      <nav aria-label={dict.curriculum.trackLabel} className="mt-8 flex flex-wrap gap-2 text-sm">
        {TRACKS.map((t) => (
          <Link
            key={t}
            href={`/${locale}/curriculum?track=${t}`}
            aria-current={t === track ? "true" : undefined}
            className={
              t === track
                ? "rounded-full bg-accent px-3 py-1 font-semibold text-white hover:bg-accent-hover"
                : "rounded-full border border-border px-3 py-1 text-muted hover:border-accent hover:text-foreground"
            }
          >
            {dict.curriculum.track[t]}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-sm font-medium">
        {dict.curriculum.summaryHeading}: {coveredRequired.length}/{required.length}
      </p>

      <div className="mt-10 space-y-10">
        {moduleNumbers.map((number) => {
          const parentModule = modulesByNumber.get(number) as Module;
          const list = byModule.get(number)!.slice().sort((a, b) => a.code.localeCompare(b.code));
          return (
            <section key={number}>
              <h2 className="text-xl font-semibold">
                {number} {parentModule.name[locale]}
              </h2>
              <div className="mt-4 space-y-3">
                {list.map((course) => (
                  <CourseRow
                    key={course.code}
                    course={course}
                    status={course.status[track]}
                    locale={locale}
                    dict={dict}
                    isPractical={isPracticalCourse(course)}
                    conceptById={conceptById}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
