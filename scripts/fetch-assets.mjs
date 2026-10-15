#!/usr/bin/env node
/**
 * Lädt die Bilder der alten Website nach public/images/<ordner>/ herunter.
 * Dateinamen werden sprechend vereinfacht (Hashes und TYPO3-Größenangaben entfernt).
 * Fehlgeschlagene Downloads werden durch eine Holzton-Platzhaltergrafik (SVG) ersetzt
 * und in scripts/fetch-assets.log vermerkt.
 *
 * Aufruf: node scripts/fetch-assets.mjs [--force]
 */
import { mkdir, writeFile, access, appendFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images");
const LOG = path.join(ROOT, "scripts", "fetch-assets.log");
const BASE = "https://www.lunnebach.com/wp-content/uploads/";
const FORCE = process.argv.includes("--force");

/** @type {Record<string, string[]>} */
export const ASSETS = {
  brand: [
    "2020/09/logo-weiss-orange.png",
    "2021/02/logo-2.png",
    "2021/01/rolf_lunnebach_weiss.png",
    "2023/11/siegel.png",
  ],
  hero: [
    "2023/11/moebelbau-vitrine.jpg",
    "2023/11/buero-box.jpg",
    "2023/11/holzwerkstaette-lunnebach.jpg",
    "2023/11/creative-wohntraeume.webp",
    "2023/11/objekteinrichtung.jpg",
  ],
  team: [
    "2023/11/team-lunnebach.jpg",
    "2023/11/lunnebach-team2.webp",
    "2023/11/team1.jpg",
    "2023/11/team2.jpg",
    "2023/11/team3.jpg",
    "2023/11/team4.jpg",
    "2023/11/team5.jpg",
    "2023/11/team9.jpg",
  ],
  privat: [
    "2023/11/kuechenmoebel.jpg",
    "2023/11/spec-cont-moebel.jpg",
    "2023/11/spec-cont-einbau.jpg",
    "2023/11/spec-cont-bad.jpg",
    "2023/11/spec-cont-garten.jpg",
    "2023/11/acc_kueche.jpg",
    "2023/11/cc_moebel.jpg",
    "2023/11/acc_einbauschrank.jpg",
    "2023/11/cc_bad.jpg",
    "2023/11/acc_outdoor-1.jpg",
  ],
  "privat/kueche": [
    "2023/11/csm_kueche_8ce856ecb0.jpg",
    "2023/11/csm_herdfeld_e9529026d2-26-800-600-80.jpg",
    "2023/11/csm_kueche_8ce856ecb0-1.jpg",
    "2023/11/csm_kueche_nussbaum_b774ac0a03-30-800-600-80.jpg",
    "2023/11/csm_kuechenschraenke_fb4fc66cad__1_-28-800-600-80.jpg",
    "2023/11/csm_schrank_thermomix_5c676fb423-31-800-600-80.jpg",
    "2023/11/csm_spuele_arbeitsplatte_f62d9f9a03-32-800-600-80.jpg",
  ],
  "privat/wohnen": [
    "2023/11/csm_wohnzimmer-vitrine-detail_ebd6d58a39.jpg",
    "2023/11/csm_bibliothek_02_8bdd396cae-40-800-600-80.jpg",
    "2023/11/csm_innenausbau_02_d822880475-41-800-600-80.jpg",
    "2023/11/csm_schlafzimmer_bett_spiegeldetail_3cd6bc581a-42-800-600-80.jpg",
    "2023/11/csm_schlafzimmer_doppeltuer_09dc65915c-43-800-600-80.jpg",
    "2023/11/csm_schlafzimmer_f84fce109c-47-800-600-80.jpg",
    "2023/11/csm_spiegel_schrankwand_schlafzimmer_1d62718083-44-800-600-80.jpg",
    "2023/11/csm_wohnzimmer_schrankwand_8a92bda63d-45-800-600-80.jpg",
    "2023/11/csm_wohnzimmer_vitrine_b0e7e303e5-46-800-600-80.jpg",
  ],
  "privat/einbau": [
    "2023/11/csm_schrankwand_5d84acd440.jpg",
    "2023/11/csm_raumtrenner_d6e0376abb-56-800-600-80.jpg",
    "2023/11/csm_schrank_schraege_8c14911831-57-800-600-80.jpg",
    "2023/11/csm_schrankwand_hoch_9e4c0533b2-58-800-600-80.jpg",
  ],
  "privat/bad": [
    "2023/11/badezimmermoebel-individuell.jpg",
    "2023/11/csm_bad_01_9988181d17-64-800-600-80.jpg",
    "2023/11/csm_bad_02_cec6baac9c-65-800-600-80.jpg",
    "2023/11/csm_bad_03_8df120437a-66-800-600-80.jpg",
    "2023/11/csm_bad_04_f7042a4976-67-800-600-80.jpg",
    "2023/11/csm_bad_sideboard_1deb1e84d1-68-800-600-80.jpg",
    "2023/11/csm_bad_waschbecken_39c2e605e8-69-800-600-80.jpg",
  ],
  "privat/outdoor": [
    "2023/11/csm_garten-terrassenbau_292ee7ea02.jpg",
    "2023/11/csm_garten_01_f941805190-76-800-600-80.jpg",
    "2023/11/csm_garten_02_ac1fe404b0-77-800-600-80.jpg",
    "2023/11/csm_garten_03_0d3d1ec486-78-800-600-80.jpg",
    "2023/11/csm_garten_04_a9d0be5687-79-800-600-80.jpg",
  ],
  gewerbe: [
    "2023/11/ladenbau-individuell.jpg",
    "2023/11/praxiseinrichtung_individuell.jpg",
    "2023/11/bueroeinrichtung-individuell.jpg",
    "2023/11/freizeit-spec.jpg",
    "2023/11/acc_obj.jpg",
    "2023/11/acc_buero.jpg",
    "2023/11/acc_prax.jpg",
    "2023/11/acc-freizeitanlagen.jpg",
  ],
  "gewerbe/ladenbau": [
    "2023/11/csm_counter_e68c8acb35-108-800-600-80.jpg",
    "2023/11/csm_display_close_285b0c9933-109-800-600-80.jpg",
    "2023/11/csm_ladenbau_delikatessen_fc02bbe1e5-110-800-600-80.jpg",
    "2023/11/csm_ladenbau_friseur_counter_b6b0ef35bf-112-800-600-80.jpg",
    "2023/11/csm_ladenbau_friseur_d47ef0ee0f-111-800-600-80.jpg",
    "2023/11/csm_ladenbau_tee_c672eab1ff-113-800-600-80.jpg",
    "2023/11/csm_wanddisplay_0f329eda1b-114-800-600-80.jpg",
    "2023/11/ladenbau_koblenz-115-800-600-80.jpg",
  ],
  "gewerbe/friseursalon": [
    "2023/11/maerten1-149-800-600-80.jpg",
    "2023/11/maerten2-150-800-600-80.jpg",
    "2023/11/maerten3-151-800-600-80.jpg",
    "2023/11/maerten4-152-800-600-80.jpg",
    "2023/11/maerten5-153-800-600-80.jpg",
    "2023/11/maerten6-154-800-600-80.jpg",
    "2023/11/maerten7-155-800-600-80.jpg",
  ],
  "gewerbe/buero": [
    "2023/11/csm_buero_mit_boden_ca03d9e954-95-800-600-80.jpg",
    "2023/11/csm_buero_mit_tisch_b6ad0cb05b-88-800-600-80.jpg",
    "2023/11/csm_buero_totale_bb399ac3a2-89-800-600-80.jpg",
    "2023/11/csm_bueroanlage_ecke_5e3de20f91-84-800-600-80.jpg",
    "2023/11/csm_bueroanlage_gesamtansicht_4f0dfb02b3-85-800-600-80.jpg",
    "2023/11/csm_bueroanlage_innensicht_fc8e36abd5-86-800-600-80.jpg",
    "2023/11/csm_bueroanlage_medienschrank_5c89c0a756-87-800-600-80.jpg",
    "2023/11/csm_konferenztisch_1_7d14274ce7-90-800-600-80.jpg",
    "2023/11/csm_konferenztisch_2_683a9d9071-91-800-600-80.jpg",
    "2023/11/csm_oberflaeche_b3977e5bb1-92-800-600-80.jpg",
    "2023/11/csm_schrank_und_sideboard_5d2991db41-93-800-600-80.jpg",
  ],
  "gewerbe/emser-therme": [
    "2023/11/csm_emser_therme_aussenansicht_0fcfc39f92-124-800-600-80.jpg",
    "2023/11/csm_emser_therme_aussenduschen_518313552c-125-800-600-80.jpg",
    "2023/11/csm_emser_therme_gang_8a5ec6b106-126-800-600-80.jpg",
    "2023/11/csm_emser_therme_innenansicht_560b3b4c8a-127-800-600-80.jpg",
    "2023/11/csm_emser_therme_relaxbereich_c588df1e33-128-800-600-80.jpg",
    "2023/11/csm_emser_therme_sitzecke_a0b36d1cc9-129-800-600-80.jpg",
    "2023/11/ems_lounge-136-800-600-80.jpg",
  ],
};

/** Vereinfacht einen Originaldateinamen zu einem sprechenden Namen. */
export function simplifyName(file) {
  const ext = path.extname(file).toLowerCase();
  let base = path.basename(file, path.extname(file));
  base = base
    .replace(/^csm_/, "")
    .replace(/_[0-9a-f]{10}(?=$|[-_])/, "") // TYPO3-Hash
    .replace(/-\d+-\d+-\d+-\d+$/, "") // -26-800-600-80
    .replace(/^maerten(\d+)$/, "friseursalon-$1")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return base + ext;
}

/** Platzhalter in Holzton mit dezenter Maserung (SVG). */
function placeholderSvg(label) {
  const lines = Array.from({ length: 14 }, (_, i) => {
    const y = 30 + i * 42;
    const a = 6 + ((i * 7) % 11);
    return `<path d="M0 ${y} C 200 ${y - a}, 400 ${y + a}, 800 ${y - a / 2}" stroke="#6f5338" stroke-opacity="0.18" fill="none" stroke-width="${1 + (i % 3)}"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#a88762"/>${lines}<text x="24" y="572" font-family="monospace" font-size="14" fill="#2b221a" fill-opacity="0.6">${label}</text></svg>`;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "lunnebach-relaunch-asset-fetch" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastError;
}

async function main() {
  await rm(LOG, { force: true });
  let ok = 0;
  let skipped = 0;
  const failed = [];
  const jobs = [];

  for (const [folder, files] of Object.entries(ASSETS)) {
    const dir = path.join(OUT, folder);
    await mkdir(dir, { recursive: true });
    for (const rel of files) {
      jobs.push(async () => {
        const name = simplifyName(rel);
        const target = path.join(dir, name);
        if (!FORCE && (await exists(target))) {
          skipped++;
          return;
        }
        try {
          const buf = await download(BASE + rel);
          await writeFile(target, buf);
          ok++;
          console.log(`✓ ${folder}/${name}`);
        } catch (err) {
          const svgTarget = target.replace(/\.\w+$/, ".svg");
          await writeFile(svgTarget, placeholderSvg(`${folder}/${name} – Platzhalter`));
          failed.push(`${BASE + rel} → ${folder}/${path.basename(svgTarget)} (${err.message})`);
          console.warn(`✗ ${folder}/${name}: ${err.message} – Platzhalter erzeugt`);
        }
      });
    }
  }

  // einfache Parallelisierung (6 gleichzeitige Downloads)
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) await queue.shift()();
    }),
  );

  if (failed.length) {
    await appendFile(LOG, failed.join("\n") + "\n");
  }
  console.log(`\nFertig: ${ok} geladen, ${skipped} übersprungen, ${failed.length} fehlgeschlagen.`);
  if (failed.length) console.log(`Details: ${path.relative(ROOT, LOG)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
