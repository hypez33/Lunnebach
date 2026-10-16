/**
 * Leitet die dunkle Logo-Variante (für hellen Grund) aus der größten verfügbaren PNG ab:
 * logo-weiss-orange.png (300 × 69) → logo-dunkel.png. Weiße Schrift wird Dunkelbraun, Orange bleibt,
 * Kantenglättung (Alpha) bleibt erhalten. Die Original-Dunkelvariante logo-2.png hat nur 200 × 46 px.
 * Übergangslösung, bis das Logo als SVG vorliegt (TODO-CONTENT.md, Priorität hoch).
 *   node scripts/derive-logo.mjs
 */
import sharp from "sharp";

const SRC = "public/images/brand/logo-weiss-orange.png";
const OUT = "public/images/brand/logo-dunkel.png";
const INK = [0x2b, 0x21, 0x1c]; // Schriftfarbe der Original-Dunkelvariante

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const max = Math.max(r, g, b);
  const sat = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
  if (sat < 0.18 && max > 150) {
    data[i] = INK[0];
    data[i + 1] = INK[1];
    data[i + 2] = INK[2];
  }
}
await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`${OUT}: ${info.width} × ${info.height}`);
