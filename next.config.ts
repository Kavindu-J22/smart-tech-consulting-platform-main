import type { NextConfig } from "next";

// cacheComponents and partialPrefetching are off on purpose: with them on, every page that
// reads the login session needs its own <Suspense> boundary. See docs/decisions/.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
