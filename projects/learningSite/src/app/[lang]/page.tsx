import { lang } from "next/root-params";

export default async function HomePage() {
  const locale = await lang();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold">FKM Kompass ({locale})</h1>
    </div>
  );
}
