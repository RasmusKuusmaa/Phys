import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  experimental: {
    // app/[lang]/layout.tsx is the app's only root layout (no top-level
    // app/layout.tsx), which is exactly the case Next 16's docs call out as
    // needing global-not-found.tsx: a route-segment not-found.tsx only
    // fires when notFound() is thrown inside an already-matched [lang]
    // segment, not for a URL that matches no route at all.
    globalNotFound: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
