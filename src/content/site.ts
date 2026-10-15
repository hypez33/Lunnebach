/**
 * Globale Stammdaten. Später: Payload-Global „site“.
 */
export const site = {
  name: "Lunnebach",
  legalName: "Rolf Lunnebach – die creative Holzwerkstätte",
  claim: "Die creative Holzwerkstätte",
  owner: "Tischlermeister Rolf Lunnebach",
  url: "https://www.lunnebach.com",
  description:
    "Tischlerei in Koblenz: Küchen, Möbel und Einbauschränke nach Maß sowie Ladenbau, Praxis-, Büro- und Objekteinrichtung. Planung, Fertigung und Montage aus einer Hand.",
  address: {
    street: "Alemannenstraße 21",
    zip: "56072",
    city: "Koblenz",
    region: "Rheinland-Pfalz",
    country: "DE",
    // [PLATZHALTER] Koordinaten näherungsweise – vor Livegang prüfen (TODO-CONTENT.md)
    geo: { lat: 50.3663, lng: 7.5527 },
  },
  phone: { display: "0261 61963", href: "tel:+4926161963", intl: "+49 261 61963" },
  email: "rolf@lunnebach.com",
  // [PLATZHALTER] Öffnungszeiten
  openingHours: [
    { days: "Mo – Do", time: "7:30 – 16:30 Uhr" },
    { days: "Fr", time: "7:30 – 13:00 Uhr" },
    { days: "Ausstellung", time: "nach Vereinbarung" },
  ],
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "07:30", closes: "16:30" },
    { days: ["Friday"], opens: "07:30", closes: "13:00" },
  ],
  responseTime: "zwei Werktagen", // [PLATZHALTER]
  youtubeId: "RBPyLdsKxfs",
  cabinet: {
    name: "Cabinet",
    url: "https://www.cabinet-koblenz.de/",
    tagline: "Einbauschränke und Schiebetüren nach Maß",
  },
  copyrightYear: 2026,
  foundedYearsLabel: "seit fast 30 Jahren",
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const mainNav: NavItem[] = [
  { label: "Privat", href: "/privat", description: "Wohnräume" },
  { label: "Gewerbe", href: "/gewerbe", description: "Objekteinrichtung" },
  { label: "Projekte", href: "/projekte", description: "Ausgewählte Arbeiten" },
  { label: "Werkstatt", href: "/werkstatt", description: "Über uns" },
  { label: "Karriere", href: "/karriere", description: "Offene Stellen" },
];

export const legalNav: NavItem[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Barrierefreiheit", href: "/barrierefreiheit" },
];
