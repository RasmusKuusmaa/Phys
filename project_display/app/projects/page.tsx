import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Projects
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        There currently isn&apos;t any content here.
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50"
      >
        Back
      </Link>
    </div>
  );
}
