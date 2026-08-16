import { getDictionary } from "@/i18n/dictionaries";
import { Math } from "@/components/Math";

export default async function HomePage() {
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.home.heading}</h1>
      <p className="mt-4 text-lg text-muted">{dict.home.subheading}</p>
      <p className="mt-8">
        <Math tex="F = ma" display />
      </p>
    </div>
  );
}
