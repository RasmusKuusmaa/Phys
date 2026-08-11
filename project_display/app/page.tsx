import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Physics Playground
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/projects"
          className="flex h-12 w-52 items-center justify-center rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Projects
        </Link>
        <Link
          href="/paper-reproductions"
          className="flex h-12 w-52 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-base font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Paper Reproductions
        </Link>
      </div>
    </div>
  );
}
