import type { Project } from "./types";

/** Später: Payload-Collection „projects“ */
export const projects: Project[] = [
  {
    slug: "emser-therme",
    title: "Emser Therme",
    world: "gewerbe",
    category: "Freizeit",
    location: "Bad Ems",
    year: "[Jahr]",
    services: ["Planung", "Innenausbau", "Sonderanfertigung", "Montage"],
    teaser: "Relaxbereich, Sitznischen, Gänge und Lounge in Holz – gebaut für Feuchtigkeit und Dauerbetrieb.",
    heroImage: "gewerbe/emser-therme/ems-lounge",
    gallery: [
      { image: "gewerbe/emser-therme/emser-therme-gang", caption: "Gang mit Lamellenwand und Liegenische" },
      { image: "gewerbe/emser-therme/emser-therme-sitzecke", caption: "Sitznische mit beleuchtetem Rahmen" },
      { image: "gewerbe/emser-therme/emser-therme-innenansicht", caption: "Ruhebereich" },
      { image: "gewerbe/emser-therme/emser-therme-relaxbereich", caption: "Relaxbereich" },
      { image: "gewerbe/emser-therme/emser-therme-aussenansicht", caption: "Außenbereich mit Liegen" },
      { image: "gewerbe/emser-therme/emser-therme-aussenduschen", caption: "Sichtschutz an den Außenduschen" },
      { image: "gewerbe/emser-therme/ems-lounge", caption: "Lounge mit Bar" },
    ],
    story: {
      task: "Neugestaltung von Innenbereichen einer Therme: Räume zum Ankommen und Abschalten, die täglich viele Gäste aushalten.",
      solution:
        "Relaxbereich, Sitznischen, Gänge und Lounge in Holz – ausgelegt für Feuchtigkeit und Dauerbetrieb. Geschwungene Lamellenwände führen durch die Räume, beleuchtete Nischen laden zum Verweilen ein.",
      result: "[PLATZHALTER: Umfang, Jahr]",
    },
    dimension: { label: "12 400", orientation: "horizontal" },
    featured: true,
    placeholder: true,
  },
  {
    slug: "friseursalon-koblenz",
    title: "Friseursalon",
    world: "gewerbe",
    category: "Ladenbau",
    location: "Koblenz",
    year: "[Jahr]",
    services: ["Komplettberatung", "Ladenbau", "Gewerke-Koordination", "Montage"],
    teaser: "Arbeitsplätze auf Rollen, eine Mixecke für große Farbauswahl – und Elektro und Maler aus einer Hand.",
    heroImage: "gewerbe/friseursalon/friseursalon-7",
    gallery: [
      { image: "gewerbe/friseursalon/friseursalon-7", caption: "Arbeitsplätze zwischen Holzbalken" },
      { image: "gewerbe/friseursalon/friseursalon-5", caption: "Regalwand für die Farbauswahl" },
      { image: "gewerbe/friseursalon/friseursalon-4", caption: "Mixecke mit Spüle" },
      { image: "gewerbe/friseursalon/friseursalon-3", caption: "Ablage mit Baumkante" },
      { image: "gewerbe/friseursalon/friseursalon-6", caption: "Verkaufsregal" },
      { image: "gewerbe/friseursalon/friseursalon-2", caption: "Glasregal vor Lichtleiste" },
      { image: "gewerbe/friseursalon/friseursalon-1", caption: "Garderobe im Eingang" },
    ],
    story: {
      task: "Ein junger Friseurmeister macht sich selbstständig und sucht eine flexible, moderne Einrichtung – mit Komplettberatung.",
      solution:
        "Arbeitsplätze auf Rollen für flexibles Arbeiten. Eine Mixecke für eine große Farbauswahl als handwerkliche Herausforderung. Elektro und Maler haben wir aus einer Hand koordiniert.",
      result: "Termingerecht übergeben, ein sehr zufriedener Kunde. [Kundenname nur nach Freigabe]",
    },
    quote: {
      text: "[PLATZHALTER-Zitat des Kunden – nur nach Freigabe]",
      author: "[Name], Friseurmeister",
    },
    dimension: { label: "H 2 650", orientation: "vertical" },
    featured: true,
    placeholder: true,
  },
  {
    slug: "kueche-nussbaum",
    title: "Küche in Nussbaum",
    world: "privat",
    category: "Küche",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Planung", "Tischlerküche", "Montage"],
    teaser: "Kochinsel, Hochschränke und ein eigener Platz für die Küchenmaschine – gefertigt für genau diesen Raum.",
    heroImage: "privat/kueche/kueche-nussbaum",
    gallery: [
      { image: "privat/kueche/kueche-nussbaum", caption: "Kochinsel in Nussbaum" },
      { image: "privat/kueche/herdfeld", caption: "Herdfeld mit Muldenlüfter" },
      { image: "privat/kueche/schrank-thermomix", caption: "Auszug für die Küchenmaschine" },
      { image: "privat/kueche/kueche", caption: "Kochinsel und Wandregale" },
      { image: "privat/kueche/kuechenschraenke-1", caption: "Raumhohe Hochschränke" },
      { image: "privat/kueche/spuele-arbeitsplatte", caption: "Spüle und Arbeitsplatte" },
    ],
    story: {
      task: "Eine Küche für eine Familie, die viel und gern kocht – mit viel Stauraum und kurzen Wegen.",
      solution:
        "Eine Kochinsel in Nussbaum als Mittelpunkt, raumhohe Hochschränke für Vorräte und Geräte, ein Auszug genau in Arbeitshöhe für die Küchenmaschine.",
      result: "Eine Küche, die zum Kochen einlädt – und nach Jahren noch so aussieht wie am ersten Tag.",
    },
    dimension: { label: "3 600", orientation: "horizontal" },
    featured: true,
    placeholder: true,
  },
  {
    slug: "wohnen-bibliothek",
    title: "Bibliothek und Wohnwand",
    world: "privat",
    category: "Wohnen",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Planung", "Möbelbau", "Innenausbau"],
    teaser: "Ein raumhohes Bücherregal am Panoramafenster und eine Wohnwand mit beleuchteter Vitrine.",
    heroImage: "privat/wohnen/innenausbau-02",
    gallery: [
      { image: "privat/wohnen/innenausbau-02", caption: "Bücherregal am Panoramafenster" },
      { image: "privat/wohnen/wohnzimmer-schrankwand", caption: "Wohnwand mit Vitrine" },
      { image: "privat/wohnen/wohnzimmer-vitrine", caption: "Vitrine in dunklem Holz" },
      { image: "privat/wohnen/wohnzimmer-vitrine-detail", caption: "Detail der Vitrine" },
      { image: "privat/wohnen/bibliothek-02", caption: "Einbauschränke mit Tresen" },
    ],
    story: {
      task: "Platz für eine wachsende Büchersammlung, ohne den Blick nach draußen zu verstellen.",
      solution:
        "Ein raumhohes Regal, das das Fenster einrahmt, und eine Wohnwand mit beleuchteter Vitrine für die schönsten Stücke.",
      result: "Ein ruhiger Raum mit Ordnung und Charakter.",
    },
    dimension: { label: "4 200", orientation: "horizontal" },
    featured: true,
    placeholder: true,
  },
  {
    slug: "buero-konferenz",
    title: "Büro mit Konferenztisch",
    world: "gewerbe",
    category: "Büro",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Planung", "Büroeinrichtung", "Montage"],
    teaser: "Vom Chefzimmer bis zum Besprechungsraum aus einem Guss – mit Konferenztisch nach Maß.",
    heroImage: "gewerbe/buero/konferenztisch-2",
    gallery: [
      { image: "gewerbe/buero/konferenztisch-2", caption: "Besprechungstisch" },
      { image: "gewerbe/buero/bueroanlage-gesamtansicht", caption: "Chefbüro in Kirschholz" },
      { image: "gewerbe/buero/bueroanlage-medienschrank", caption: "Medienschrank" },
      { image: "gewerbe/buero/buero-mit-boden", caption: "Arbeitsinsel mit Schiebetüren" },
      { image: "gewerbe/buero/bueroanlage-ecke", caption: "Eckschreibtisch" },
      { image: "gewerbe/buero/konferenztisch-1", caption: "Konferenzbereich" },
      { image: "gewerbe/buero/oberflaeche", caption: "Tischplatte im Detail" },
      { image: "gewerbe/buero/schrank-und-sideboard", caption: "Einbauschrank und Sideboard" },
    ],
    story: {
      task: "Eine neue Büroetage, die repräsentiert und im Alltag funktioniert.",
      solution:
        "Arbeitsplätze, Chefbüro und Konferenzbereich in einer durchgehenden Gestaltung – mit Stauraum, der Technik und Akten verschwinden lässt.",
      result: "Eine Etage aus einem Guss, termingerecht bezogen.",
    },
    dimension: { label: "4 800", orientation: "horizontal" },
    placeholder: true,
  },
  {
    slug: "schrankwand-dachschraege",
    title: "Schrankwand unter der Schräge",
    world: "privat",
    category: "Einbau",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Aufmaß", "Einbaumöbel", "Montage"],
    teaser: "Stauraum, wo vorher keiner war: Einbauschränke unter der Dachschräge und raumhohe Schrankwände.",
    heroImage: "privat/einbau/schrankwand",
    gallery: [
      { image: "privat/einbau/schrankwand", caption: "Raumhohe Schrankwand" },
      { image: "privat/einbau/schrank-schraege", caption: "Schrank unter der Dachschräge" },
      { image: "privat/einbau/raumtrenner", caption: "Raumtrenner mit Vitrinenfach" },
      { image: "privat/einbau/schrankwand-hoch", caption: "Offener Ankleideschrank" },
    ],
    story: {
      task: "Ein Dachgeschoss mit vielen Schrägen und wenig Stellfläche.",
      solution: "Einbauschränke, die jedem Winkel folgen, mit Schiebetüren, die keinen Platz beim Öffnen brauchen.",
      result: "Doppelt so viel Stauraum – und ein Raum, der aufgeräumt wirkt.",
    },
    dimension: { label: "H 2 450", orientation: "vertical" },
    placeholder: true,
  },
  {
    slug: "bad-waschtisch",
    title: "Bad mit Waschtisch und Sideboard",
    world: "privat",
    category: "Bad",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Planung", "Badmöbel", "Montage"],
    teaser: "Waschtisch und Sideboard, die Feuchtigkeit standhalten und trotzdem nach Wohnraum aussehen.",
    heroImage: "privat/bad/badezimmermoebel-individuell",
    gallery: [
      { image: "privat/bad/badezimmermoebel-individuell", caption: "Waschtisch mit Holzunterschrank" },
      { image: "privat/bad/bad-sideboard", caption: "Sideboard" },
      { image: "privat/bad/bad-waschbecken", caption: "Aufsatzwaschbecken mit Regal" },
      { image: "privat/bad/bad-01", caption: "Dunkler Waschtisch" },
      { image: "privat/bad/bad-02", caption: "Grifflose Schubladen" },
      { image: "privat/bad/bad-03", caption: "Badewanne am Fenster" },
    ],
    story: {
      task: "Ein Bad, das sich wie ein Wohnraum anfühlt – ohne Kompromisse bei Feuchtigkeit und Pflege.",
      solution: "Feuchtraumgeeignete Materialien, Holzfronten mit robuster Oberfläche, Steinplatte und viel Stauraum.",
      result: "Ein warmes, ruhiges Bad, das jeden Tag benutzt wird.",
    },
    dimension: { label: "1 800", orientation: "horizontal" },
    placeholder: true,
  },
  {
    slug: "garten-terrasse",
    title: "Terrasse und Gartenmöbel",
    world: "privat",
    category: "Outdoor",
    location: "[Ort]",
    year: "[Jahr]",
    services: ["Terrassenbau", "Outdoor-Möbel"],
    teaser: "Holzdecks, Stufen und Sitzplattformen – gebaut für Wetter und Jahreszeiten.",
    heroImage: "privat/outdoor/garten-03",
    gallery: [
      { image: "privat/outdoor/garten-03", caption: "Holzterrasse mit Pool" },
      { image: "privat/outdoor/garten-02", caption: "Sitzplattform am Ufer" },
      { image: "privat/outdoor/garten-terrassenbau", caption: "Stufen vor Natursteinmauer" },
      { image: "privat/outdoor/garten-01", caption: "Holzpodest mit Kissen" },
      { image: "privat/outdoor/garten-04", caption: "Terrassierter Garten" },
    ],
    story: {
      task: "Ein Garten am Hang, der mehr Platz zum Draußensein braucht.",
      solution: "Holzdecks auf mehreren Ebenen, Stufen und Sitzplattformen aus wetterfestem Holz.",
      result: "Ein Garten, der vom Frühjahr bis in den Herbst genutzt wird.",
    },
    dimension: { label: "6 200", orientation: "horizontal" },
    placeholder: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const featuredProjects = projects.filter((p) => p.featured);

export const worldLabel = { privat: "Privat", gewerbe: "Gewerbe" } as const;
