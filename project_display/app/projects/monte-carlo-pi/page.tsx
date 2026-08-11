import Link from "next/link";

export default function MonteCarloPiPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Monte Carlo Pi
      </h1>
      <p className="max-w-md text-center text-zinc-600 dark:text-zinc-400">
        Estimating π by randomly scattering points in a unit square and
        checking what fraction land inside the inscribed quarter circle.
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        Interactive demo coming soon.
      </p>
      <Link
        href="/projects"
        className="mt-4 text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50"
      >
        Back
      </Link>
    </div>
  );
}
