import type { Job } from "./types";

/** Später: Payload-Collection „jobs“. Karriereseite: Du-Ansprache. */
export const jobs: Job[] = [
  {
    slug: "tischlermeister-holztechniker",
    title: "Tischlermeister oder Holztechniker (m/w/d)",
    type: "Vollzeit · unbefristet",
    summary: "Du hältst die Fäden zusammen – vom ersten Kundengespräch bis zur fertigen Montage.",
    tasks: [
      "Kundenkontakt und Beratung",
      "Arbeitsvorbereitung und Auftragsabwicklung",
      "Vor- und Nachkalkulation",
      "Betreuung unserer Azubis",
    ],
    profile: [
      "Meister- oder Technikerabschluss im Tischlerhandwerk",
      "Erfahrung im Innenausbau",
      "CAD- und CNC-Kenntnisse von Vorteil",
    ],
    offer: ["Unbefristeter Vertrag", "Verantwortung in einem kleinen Team", "Abwechslungsreiche Projekte für Privat und Gewerbe"],
  },
  {
    slug: "tischler-produktion",
    title: "Tischler / Schreiner Produktion (m/w/d)",
    type: "Vollzeit · unbefristet",
    summary: "Du baust Unikate – an der CNC und von Hand im Bankraum – und montierst sie beim Kunden.",
    tasks: ["Produktion und Montage", "Handarbeit im Bankraum", "Oberflächenbearbeitung"],
    profile: ["Abgeschlossene Ausbildung als Tischler oder Schreiner", "Erfahrung im Möbelbau", "Führerschein Klasse B"],
    offer: ["Moderne CNC-Technik", "Unbefristeter Vertrag", "Weiterentwicklung zum Meister oder Techniker"],
  },
  {
    slug: "ausbildung-tischler",
    title: "Ausbildung Tischler/in (m/w/d)",
    type: "Ausbildung · 3 Jahre dual",
    summary: "Drei Jahre, in denen du früh an echten Kundenaufträgen mitarbeitest.",
    tasks: ["Mitarbeit an echten Kundenaufträgen", "Arbeit an modernen Maschinen", "Handwerkliche Grundlagen im Bankraum"],
    profile: ["Freude am Werkstoff Holz", "Sorgfalt und räumliches Denken", "Am besten startest du mit einem Praktikum"],
    offer: ["Feste Ansprechpartner", "Übernahmechance", "Ein Team, das gern ausbildet"],
  },
];

export const benefits = [
  "Familienbetrieb mit rund 10 Leuten",
  "Moderne CNC-Technik",
  "Abwechslungsreiche Projekte für Privat- und Gewerbekunden",
  "Unbefristeter Vertrag",
  "Weiterentwicklung zum Meister oder Techniker",
];
