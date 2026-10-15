import { projects } from "../src/content/projects";

export const routes = [
  "/",
  "/privat",
  "/gewerbe",
  "/projekte",
  ...projects.map((p) => `/projekte/${p.slug}`),
  "/werkstatt",
  "/karriere",
  "/anfrage",
  "/anfrage/danke",
  "/impressum",
  "/datenschutz",
  "/barrierefreiheit",
];
