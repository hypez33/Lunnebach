/**
 * Seitentexte (Copy Deck). Später: Payload-Collection „pages“ mit Blocks.
 */
export const home = {
  hero: {
    eyebrow: "Tischlerei · Koblenz · seit fast 30 Jahren",
    title: "Räume und Möbel, auf den Millimeter gedacht.",
    titleLines: ["Räume und Möbel,", "auf den Millimeter gedacht."],
    subline:
      "Lunnebach plant und fertigt Einrichtungen nach Maß – für Ihr Zuhause, für Praxis, Laden und Hotel. Entworfen in Koblenz, gefertigt in der eigenen Werkstatt, montiert von unserem Team.",
    ctaPrimary: { label: "Projekt anfragen", href: "/anfrage" },
    ctaSecondary: { label: "Projekte ansehen", href: "/projekte" },
  },
  intro: {
    statement: "Trends kommen und gehen. Gute Möbel bleiben.",
    facts: ["Fast 30 Jahre Erfahrung", "Planung bis Montage aus einer Hand", "CNC-Präzision und Handarbeit"],
  },
  worlds: [
    {
      key: "privat",
      eyebrow: "Wohnräume",
      title: "Für Zuhause",
      text: "Küchen, Wohn- und Schlafräume, Einbauschränke, Bäder und Outdoor. Jedes Stück ein Unikat, das in Ihren Raum passt – nicht in einen Katalog.",
      cta: "Wohnräume entdecken",
      href: "/privat",
      image: "privat/wohnen/wohnzimmer-schrankwand",
    },
    {
      key: "gewerbe",
      eyebrow: "Objekteinrichtung",
      title: "Für Unternehmen",
      text: "Ladenbau, Praxis- und Apothekeneinrichtung, Büros, Hotels und Freizeitanlagen. Wir planen mit, koordinieren die Gewerke und liefern termingerecht.",
      cta: "Objekteinrichtung entdecken",
      href: "/gewerbe",
      image: "gewerbe/emser-therme/ems-lounge",
    },
  ],
  featured: {
    title: "Ausgewählte Arbeiten",
    intro: "Jedes Projekt beginnt mit einem Gespräch und endet mit einem Raum, der funktioniert.",
  },
  workshop: {
    eyebrow: "Die creative Holzwerkstätte",
    quote:
      "Creativität heißt nicht, dem Zeitgeist zu folgen. Creativität bedeutet, seinen Kunden zu erfassen. Außergewöhnliches zu wagen. Neue Wege zu gehen. Lösungen zu finden.",
    author: "Tischlermeister Rolf Lunnebach",
    text: "Planer und Tischler arbeiten bei uns unter einem Dach. Wir geben uns erst zufrieden, wenn alles stimmt – bis zur letzten Fuge.",
    stats: [
      { value: 30, prefix: "~", label: "Jahre Erfahrung" },
      { value: 10, prefix: "~", label: "Menschen im Team" },
      { value: 1, label: "Werkstatt in Koblenz" },
      // [PLATZHALTER – Wert prüfen]
      { value: 0.1, decimals: 1, suffix: " mm", label: "CNC-Genauigkeit", placeholder: true },
    ],
  },
  values: { eyebrow: "Haltung", title: "Woran wir uns messen lassen." },
  career: {
    title: "Arbeite da, wo Unikate entstehen.",
    text: "Wir gehören zu den Top-Arbeitgebern im Handwerk. Bei uns baust du keine Serie, sondern Projekte, die es nur einmal gibt – mit moderner CNC-Technik und echter Handarbeit.",
    cta: "Offene Stellen",
  },
  cabinet: {
    title: "Cabinet – Einbauschränke und Schiebetüren nach Maß.",
    text: "Sehen, anfassen, ausprobieren: In unserer Cabinet-Ausstellung in Koblenz finden Sie Lösungen für jede Nische und jede Dachschräge.",
    cta: "Zur Cabinet-Website",
  },
  inquiry: {
    title: "Erzählen Sie uns von Ihrem Raum.",
    text: "Ein paar Angaben genügen. Wir melden uns innerhalb von zwei Werktagen und vereinbaren ein unverbindliches Gespräch.",
    cta: "Projekt anfragen",
  },
} as const;
