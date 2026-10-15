import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // 301-Weiterleitungen der alten WordPress-URLs
  async redirects() {
    const map: [string, string][] = [
      ["/ueber-uns", "/werkstatt"],
      ["/creativer-moebelbau", "/privat"],
      ["/objekteinrichtung", "/gewerbe"],
      ["/jobs", "/karriere"],
      ["/kontakt-2", "/anfrage"],
      ["/haftungsausschluss", "/impressum"],
    ];
    // statusCode 301 statt `permanent` (das wäre 308), damit es exakt der alten Weiterleitung entspricht
    return map.flatMap(([source, destination]) => [
      { source, destination, statusCode: 301 as const },
      { source: `${source}/`, destination, statusCode: 301 as const },
    ]);
  },
};

export default nextConfig;
