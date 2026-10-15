#!/usr/bin/env node
/**
 * Liest alle Bilder unter public/images, ermittelt Maße und Blur-Placeholder (sharp)
 * und erzeugt src/content/images.ts. Zusätzlich wird die Akzentfarbe aus dem Logo
 * (dominanter Orangeton) per Pixelanalyse bestimmt und in src/content/brand.generated.json
 * abgelegt.
 *
 * Aufruf: node scripts/build-image-manifest.mjs
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { ASSETS, simplifyName } from "./fetch-assets.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const IMAGES = path.join(PUBLIC, "images");
const BASE = "https://www.lunnebach.com/wp-content/uploads/";

/** Beschreibende Alt-Texte (aus Dateiname, Kategorie und Sichtung). Alle altReviewed: false. */
const ALT = {
  "brand/logo-weiss-orange.png": "Rolf Lunnebach – die creative Holzwerkstätte",
  "brand/logo-2.png": "Rolf Lunnebach – die creative Holzwerkstätte",
  "brand/rolf-lunnebach-weiss.png":
    "Signet Rolf Lunnebach mit Werkzeugsymbolen: Stechbeitel, Zollstock, Schraubzwinge, Bleistift und Zirkel",
  "brand/siegel.png": "Siegel „Top Arbeitgeber – ZuFa ’18 Check“ des Dienstleistungszentrums Handwerk",

  "hero/moebelbau-vitrine.jpg": "Schmale, raumhohe Vitrine mit Glasböden und dunklem Holzrahmen in einer Wandnische",
  "hero/buero-box.jpg": "Geschwungener Schreibtisch in Kirschholz mit schwarzer Arbeitsplatte und Chefsessel",
  "hero/holzwerkstaette-lunnebach.jpg":
    "Grafik der fünf Arbeitsschritte im Kreis: Idee, Planung, Entwicklung, Fertigung und Montage",
  "hero/creative-wohntraeume.webp": "Offener Wohnraum mit Kücheninsel in Holz, Hängeleuchten und Blick ins Grüne",
  "hero/objekteinrichtung.jpg": "Weiße Empfangstheke eines Friseursalons mit indirekter Beleuchtung und Holzablage",

  "team/team-lunnebach.jpg": "Das Lunnebach-Team in Arbeitskleidung in der Werkstatt vor den Maschinen",
  "team/lunnebach-team2.webp": "Drei Tischler beugen sich in der Werkstatt gemeinsam über einen Plan",
  "team/team1.jpg": "Porträt eines lächelnden Teammitglieds im karierten Hemd",
  "team/team2.jpg": "Porträt einer Mitarbeiterin mit Brille und rosafarbener Bluse",
  "team/team3.jpg": "Tischler bei der Handarbeit an der Hobelbank",
  "team/team4.jpg": "Lachender Tischler bearbeitet ein Werkstück in der Werkstatt",
  "team/team5.jpg": "Tischler mit Mütze an der Oberfräse",
  "team/team9.jpg": "Tischler mit Brille prüft ein Werkstück an der Werkbank",

  "privat/kuechenmoebel.jpg": "Bildstreifen: Ausschnitt einer Tischlerküche mit Holzfronten",
  "privat/spec-cont-moebel.jpg": "Bildstreifen: Schlafzimmer mit orangefarbenem Schrankelement",
  "privat/spec-cont-einbau.jpg": "Bildstreifen: Schrankwand mit Glasfront im Schlafzimmer",
  "privat/spec-cont-bad.jpg": "Bildstreifen: Waschtisch mit Holzfront und Steinplatte",
  "privat/spec-cont-garten.jpg": "Bildstreifen: Natursteinmauer mit Holzstufen im Garten",
  "privat/acc-kueche.jpg": "Kücheninsel mit Holzfront und dunkler Arbeitsplatte",
  "privat/cc-moebel.jpg": "Schlafzimmer mit orangefarbenem Schrankmodul und Bett",
  "privat/acc-einbauschrank.jpg": "Schlafzimmer mit raumhoher Schrankwand",
  "privat/cc-bad.jpg": "Waschtisch mit Holzunterschrank und Steinplatte",
  "privat/acc-outdoor-1.jpg": "Holzterrasse mit eingelassenem Pool",

  "privat/kueche/kueche.jpg": "Tischlerküche mit Kochinsel in Eiche, schwarzer Rückwand und Hängeleuchten",
  "privat/kueche/herdfeld.jpg": "Detail: Induktionskochfeld mit integriertem Muldenlüfter in dunkler Arbeitsplatte",
  "privat/kueche/kueche-1.jpg": "Kochinsel in Eiche mit offenen Wandregalen und Hängeleuchten",
  "privat/kueche/kueche-nussbaum.jpg": "Küche in Nussbaum mit Kochinsel, Dunstabzug und Fensterfront",
  "privat/kueche/kuechenschraenke-1.jpg": "Raumhohe Küchenschränke in Holz und Schwarz mit eingebautem Backofen",
  "privat/kueche/schrank-thermomix.jpg": "Hochschrank mit ausziehbarem Fach für die Küchenmaschine",
  "privat/kueche/spuele-arbeitsplatte.jpg": "Küchenzeile mit dunkler Arbeitsplatte und Unterschränken in Holz",

  "privat/wohnen/wohnzimmer-vitrine-detail.jpg": "Detail einer beleuchteten Vitrine mit Glasböden und Holzrahmen",
  "privat/wohnen/bibliothek-02.jpg": "Heller Raum mit grifflosen Einbauschränken und Tresen vor dem Fenster",
  "privat/wohnen/innenausbau-02.jpg": "Raumhohes Bücherregal neben einem Panoramafenster",
  "privat/wohnen/schlafzimmer-bett-spiegeldetail.jpg": "Detail eines Bettkopfteils in Holz mit Spiegel",
  "privat/wohnen/schlafzimmer-doppeltuer.jpg": "Schrank mit zwei hellen Türen in einem Holzrahmen",
  "privat/wohnen/schlafzimmer.jpg": "Schlafzimmer mit orangefarbenem Schrankmodul, Bett und Glasfront",
  "privat/wohnen/spiegel-schrankwand-schlafzimmer.jpg": "Schlafzimmer mit verspiegelter Schiebetür-Schrankwand",
  "privat/wohnen/wohnzimmer-schrankwand.jpg":
    "Weiße Wohnzimmer-Schrankwand mit Nussbaum-Elementen, beleuchteter Vitrine und grünem Lowboard",
  "privat/wohnen/wohnzimmer-vitrine.jpg": "Weiße Wohnwand mit dunkler Holzvitrine und beleuchteten Nischen",

  "privat/einbau/schrankwand.jpg": "Schlafzimmer mit raumhoher Schrankwand und Glasmosaik-Front",
  "privat/einbau/raumtrenner.jpg": "Raumtrenner als weißer Schrank mit Vitrinenfach",
  "privat/einbau/schrank-schraege.jpg": "Einbauschrank unter der Dachschräge mit Schiebetüren",
  "privat/einbau/schrankwand-hoch.jpg": "Raumhoher, offener Ankleideschrank mit Beleuchtung",

  "privat/bad/badezimmermoebel-individuell.jpg":
    "Waschtisch mit Holzunterschrank, grauer Steinplatte und Handtuchhalter aus Edelstahl",
  "privat/bad/bad-01.jpg": "Dunkler Waschtisch mit spiegelnder Oberfläche",
  "privat/bad/bad-02.jpg": "Badezimmer-Sideboard mit grifflosen dunklen Schubladen",
  "privat/bad/bad-03.jpg": "Badewanne vor einem Fenster mit Holzleiter",
  "privat/bad/bad-04.jpg": "Badezimmer mit dunklem Einbaumöbel und Stufe",
  "privat/bad/bad-sideboard.jpg": "Langes Bad-Sideboard mit Holzfront und grauer Abdeckung",
  "privat/bad/bad-waschbecken.jpg": "Aufsatzwaschbecken auf Holzunterschrank mit offenem Regal",

  "privat/outdoor/garten-terrassenbau.jpg": "Holzstufen und Sitzbank vor einer Natursteinmauer",
  "privat/outdoor/garten-01.jpg": "Holzpodest mit Kissen, Formschnitt-Pflanzen und Pflanzschale",
  "privat/outdoor/garten-02.jpg": "Sitzplattform aus Holz am Flussufer mit Kissen und Pflanzschale",
  "privat/outdoor/garten-03.jpg": "Holzterrasse mit eingelassenem Pool und Gartenhaus",
  "privat/outdoor/garten-04.jpg": "Terrassierter Garten mit Gartenhaus und Holzwegen",

  "gewerbe/ladenbau-individuell.jpg": "Bildstreifen: Laden mit Regalwand",
  "gewerbe/praxiseinrichtung-individuell.jpg": "Bildstreifen: heller Praxisempfang",
  "gewerbe/bueroeinrichtung-individuell.jpg": "Bildstreifen: Großraumbüro mit Schreibtischen",
  "gewerbe/freizeit-spec.jpg": "Bildstreifen: Lounge mit Holzlamellen",
  "gewerbe/acc-obj.jpg": "Laden mit Regalwänden voller Produkte",
  "gewerbe/acc-buero.jpg": "Büro mit Schreibtischen vor einer Fensterfront",
  "gewerbe/acc-prax.jpg": "Praxisempfang mit grüner Wand und beleuchteter Theke",
  "gewerbe/acc-freizeitanlagen.jpg": "Lounge mit Holzlamellen und beleuchteter Sitznische",

  "gewerbe/ladenbau/counter.jpg": "Geschwungene Empfangstheke in Weiß und Hellgrün mit Logo",
  "gewerbe/ladenbau/display-close.jpg": "Bildschirm-Display in einer violetten Wandfläche",
  "gewerbe/ladenbau/ladenbau-delikatessen.jpg":
    "Verkaufstheke mit Holzfront und Lichtband vor den Regalen eines Feinkostgeschäfts",
  "gewerbe/ladenbau/ladenbau-friseur-counter.jpg": "Friseursalon mit Empfangstheke, Lichtband und Hängeleuchten",
  "gewerbe/ladenbau/ladenbau-friseur.jpg": "Friseursalon mit Waschplätzen und Regalwand",
  "gewerbe/ladenbau/ladenbau-tee.jpg": "Teeladen mit geschwungener Glastheke und Regalen",
  "gewerbe/ladenbau/wanddisplay.jpg": "Schwebendes weißes Wandboard mit Display in einem Showroom",
  "gewerbe/ladenbau/ladenbau-koblenz.jpg": "Showroom mit violetter Wand, weißem Sideboard und grüner Theke",

  "gewerbe/friseursalon/friseursalon-1.jpg": "Dunkle Natursteinwand mit Garderobe aus Edelstahl im Eingangsbereich",
  "gewerbe/friseursalon/friseursalon-2.jpg": "Glasregal mit Produkten vor einer Lichtleiste",
  "gewerbe/friseursalon/friseursalon-3.jpg": "Ablage aus Eiche mit Baumkante an einem Spiegelplatz",
  "gewerbe/friseursalon/friseursalon-4.jpg": "Mixecke mit Edelstahlspüle und schwarzer Arbeitsplatte",
  "gewerbe/friseursalon/friseursalon-5.jpg": "Regalwand mit vielen Fächern für eine große Farbauswahl",
  "gewerbe/friseursalon/friseursalon-6.jpg": "Verkaufsregal mit Glasböden und Pflegeprodukten",
  "gewerbe/friseursalon/friseursalon-7.jpg": "Arbeitsplätze mit Spiegeln und schwarzen Friseurstühlen zwischen Holzbalken",

  "gewerbe/buero/buero-mit-boden.jpg": "Arbeitsinsel mit Schiebetüren und Sideboard in einem hellen Büro",
  "gewerbe/buero/buero-mit-tisch.jpg": "Großraumbüro mit Schreibtischen vor einer Fensterfront",
  "gewerbe/buero/buero-totale.jpg": "Helles Büro mit Schreibtisch, Besprechungsbereich und Holzboden",
  "gewerbe/buero/bueroanlage-ecke.jpg": "Eckschreibtisch in Kirschholz mit Hochschränken",
  "gewerbe/buero/bueroanlage-gesamtansicht.jpg": "Chefbüro mit geschwungenem Schreibtisch in Kirschholz und Teppich",
  "gewerbe/buero/bueroanlage-innensicht.jpg": "Geschwungener Schreibtisch mit schwarzer Platte vor Schrankwand in Kirschholz",
  "gewerbe/buero/bueroanlage-medienschrank.jpg": "Medienschrank in Kirschholz mit eingebautem Bildschirm",
  "gewerbe/buero/konferenztisch-1.jpg": "Konferenztisch mit Lederstühlen vor einem Flipchart",
  "gewerbe/buero/konferenztisch-2.jpg": "Besprechungstisch mit dunkler Platte und Lederstühlen",
  "gewerbe/buero/oberflaeche.jpg": "Detail: lange dunkle Tischplatte mit Unterlagen",
  "gewerbe/buero/schrank-und-sideboard.jpg": "Büro mit weißem Einbauschrank, beleuchteter Nische und Schreibtisch",

  "gewerbe/emser-therme/emser-therme-aussenansicht.jpg": "Außenbereich der Emser Therme mit Holzliegen unter einem Holzdach",
  "gewerbe/emser-therme/emser-therme-aussenduschen.jpg": "Außenduschen mit Sichtschutz aus Holzlamellen vor historischer Fassade",
  "gewerbe/emser-therme/emser-therme-gang.jpg": "Geschwungener Gang mit Holzlamellen und beleuchteter Liegenische",
  "gewerbe/emser-therme/emser-therme-innenansicht.jpg": "Ruhebereich mit roter Wand, Holzlamellen und Liegesesseln",
  "gewerbe/emser-therme/emser-therme-relaxbereich.jpg": "Relaxbereich mit Liegesesseln vor einer roten Wand",
  "gewerbe/emser-therme/emser-therme-sitzecke.jpg": "Sitznische in einer Lamellenwand mit beleuchtetem Rahmen",
  "gewerbe/emser-therme/ems-lounge.jpg": "Lounge mit Holzdecke, beleuchteter Bar und Sitzgruppen",
};

const FALLBACK_ACCENT = "#E5731E";

async function walk(dir) {
  const entries = await readdir(dir);
  const out = [];
  for (const e of entries.sort()) {
    const p = path.join(dir, e);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|svg)$/i.test(e)) out.push(p);
  }
  return out;
}

/** Original-URLs zu vereinfachten Pfaden zuordnen. */
function originalUrlMap() {
  const map = {};
  for (const [folder, files] of Object.entries(ASSETS)) {
    for (const rel of files) map[`${folder}/${simplifyName(rel)}`] = BASE + rel;
  }
  return map;
}

/** Dominanten Orangeton im Logo ermitteln: gesättigte, deckende Pixel im Orange-Bereich mitteln. */
async function extractAccent() {
  try {
    const { data, info } = await sharp(path.join(IMAGES, "brand/logo-weiss-orange.png"))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const buckets = new Map();
    for (let i = 0; i < data.length; i += info.channels) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a < 230) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (sat < 0.55 || max < 120) continue; // nur kräftige Töne
      if (!(r > g && g > b)) continue; // Orange: R > G > B
      const key = `${r >> 3},${g >> 3},${b >> 3}`;
      const v = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      v.n++;
      v.r += r;
      v.g += g;
      v.b += b;
      buckets.set(key, v);
    }
    const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
    if (!top || top.n < 20) throw new Error("zu wenige Orange-Pixel");
    const hex = (x) => Math.round(x / top.n).toString(16).padStart(2, "0");
    return { color: `#${hex(top.r)}${hex(top.g)}${hex(top.b)}`.toUpperCase(), pixels: top.n, source: "logo" };
  } catch (err) {
    console.warn(`Akzentfarbe konnte nicht ermittelt werden (${err.message}) – Fallback ${FALLBACK_ACCENT}`);
    return { color: FALLBACK_ACCENT, pixels: 0, source: "fallback" };
  }
}

async function blurDataURL(file) {
  const buf = await sharp(file).resize(12, 12, { fit: "inside" }).flatten({ background: "#EAE5DD" }).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function main() {
  const urls = originalUrlMap();
  const files = await walk(IMAGES);
  const entries = [];
  const missingAlt = [];

  for (const file of files) {
    const rel = path.relative(IMAGES, file).split(path.sep).join("/");
    const meta = await sharp(file).metadata();
    const category = path.dirname(rel);
    const key = rel.replace(/\.svg$/, ".jpg");
    const alt = ALT[rel] ?? ALT[key];
    if (!alt) missingAlt.push(rel);
    entries.push({
      id: rel.replace(/\.\w+$/, ""),
      src: `/images/${rel}`,
      width: meta.width,
      height: meta.height,
      alt: alt ?? `[Alt-Text fehlt: ${rel}]`,
      altReviewed: false,
      originalUrl: urls[rel] ?? urls[key] ?? null,
      category,
      blurDataURL: await blurDataURL(file),
      placeholder: rel.endsWith(".svg"),
    });
  }

  const accent = await extractAccent();

  const header = `// AUTOMATISCH ERZEUGT von scripts/build-image-manifest.mjs – nicht von Hand bearbeiten.
// Alt-Texte wurden aus Kontext (Dateiname, Kategorie, Sichtung) geschrieben und müssen
// redaktionell geprüft werden (altReviewed: false).

export type ImageAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  altReviewed: boolean;
  originalUrl: string | null;
  category: string;
  blurDataURL: string;
  /** true, wenn der Download fehlschlug und eine Holzton-Platzhaltergrafik erzeugt wurde */
  placeholder: boolean;
};
`;
  const body = `\nexport const images = ${JSON.stringify(Object.fromEntries(entries.map((e) => [e.id, e])), null, 2)} as const satisfies Record<string, ImageAsset>;\n\nexport type ImageId = keyof typeof images;\n\nexport function img(id: ImageId): ImageAsset {\n  return images[id];\n}\n`;
  await writeFile(path.join(ROOT, "src/content/images.ts"), header + body);
  await writeFile(path.join(ROOT, "src/content/brand.generated.json"), JSON.stringify({ accent }, null, 2) + "\n");

  const small = entries.filter((e) => e.width < 1600 && !e.category.startsWith("brand"));
  console.log(`${entries.length} Bilder im Manifest, ${small.length} unter 1600 px Breite.`);
  console.log(`Akzentfarbe: ${accent.color} (${accent.source}, ${accent.pixels} px)`);
  if (missingAlt.length) console.log(`Fehlende Alt-Texte:\n  ${missingAlt.join("\n  ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
