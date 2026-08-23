/**
 * Absolute site origin, used anywhere a fully-qualified URL is required
 * (sitemap, robots.txt, JSON-LD). `NEXT_PUBLIC_SITE_URL` lets a custom
 * domain be set explicitly; `VERCEL_PROJECT_PRODUCTION_URL` is populated
 * automatically by Vercel for the production deployment otherwise.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}
