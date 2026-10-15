import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/privat", priority: 0.9 },
    { path: "/gewerbe", priority: 0.9 },
    { path: "/projekte", priority: 0.8 },
    { path: "/werkstatt", priority: 0.7 },
    { path: "/karriere", priority: 0.7 },
    { path: "/anfrage", priority: 0.8 },
    { path: "/impressum", priority: 0.2 },
    { path: "/datenschutz", priority: 0.2 },
    { path: "/barrierefreiheit", priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.path === "/" ? "" : p.path}`, priority: p.priority, changeFrequency: "monthly" as const })),
    ...projects.map((p) => ({ url: `${site.url}/projekte/${p.slug}`, priority: 0.6, changeFrequency: "yearly" as const })),
  ];
}
