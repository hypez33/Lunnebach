/**
 * Inhaltstypen – bewusst nah an späteren Payload-Collections gehalten
 * (projects, services, jobs, team, pages). Bilder werden per ID aus dem
 * Manifest referenziert (später: Upload-Relation auf die Media-Collection).
 */
import type { ImageId } from "./images";

export type World = "privat" | "gewerbe";

export type Project = {
  slug: string;
  title: string;
  world: World;
  /** z. B. „Freizeit“, „Küche“ – zweiter Teil der Kategorie */
  category: string;
  location: string;
  /** Fertigstellung – nur angeben, wenn bestätigt (sonst wird die Zeile nicht angezeigt) */
  year?: string;
  services: string[];
  teaser: string;
  heroImage: ImageId;
  gallery: { image: ImageId; caption?: string }[];
  story: { task: string; solution: string; result: string };
  /** Kundenstimme – wird nur mit approved: true gerendert */
  quote?: { text: string; author: string; approved: boolean };
  /** Illustrative Maßkette am Hero-Bild (Werte nicht verbindlich, s. TODO-CONTENT.md) */
  dimension: { label: string; orientation: "horizontal" | "vertical" };
  featured?: boolean;
  /** Felder, die noch Platzhalter enthalten */
  placeholder?: boolean;
};

export type Service = {
  id: string;
  world: World;
  title: string;
  /** Kurzlabel für Navigation/Anker */
  short: string;
  text: string;
  bullets?: string[];
  images: ImageId[];
  dimension?: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
  image: ImageId;
};

export type Value = { number: string; title: string; text: string };

export type Job = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  tasks: string[];
  profile: string[];
  offer: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: ImageId;
  placeholder?: boolean;
};
