import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-16 font-sans sm:px-16 dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Projects
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50"
        >
          Back
        </Link>
      </div>
      <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/projects/monte-carlo-pi"
          className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-6 transition-colors hover:border-black/[.15] hover:bg-black/[.02] dark:border-white/[.145] dark:bg-[#111] dark:hover:border-white/[.25] dark:hover:bg-white/[.04]"
        >
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
            Monte Carlo Pi
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Estimating π by randomly scattering points in a unit square and
            checking what fraction land inside the inscribed quarter circle.
          </p>
        </Link>
      </div>
    </div>
  );
}
