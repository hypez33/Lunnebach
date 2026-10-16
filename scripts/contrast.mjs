#!/usr/bin/env node
// Prüft Kontrastverhältnisse (WCAG 2.x) aller relevanten Token-Kombinationen.
// Aufruf: node scripts/contrast.mjs
import brand from "../src/content/brand.generated.json" with { type: "json" };

const hex2rgb = (h) => h.replace("#", "").match(/../g).map((x) => parseInt(x, 16));
const lum = (h) => {
  const [r, g, b] = hex2rgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a, b, t) => toHex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t));
// rgba über Grund legen
const over = (fg, alpha, bg) => mix(bg, fg, alpha);

const T = {
  paper: "#F4F1EC",
  paper2: "#EAE5DD",
  ink: "#1C1916",
  inkMuted: "#5C554D",
  accent: brand.accent.color,
  walnut: "#8A6A4A",
};
// accent-text: Accent schrittweise Richtung Ink abdunkeln, bis ≥ 4.5:1 auf paper-2 (dunklere der beiden Flächen)
let t = 0;
while (ratio(mix(T.accent, "#3A1A08", t), T.paper2) < 4.6 && t < 1) t += 0.01;
T.accentText = mix(T.accent, "#3A1A08", t);
// gedämpfter Text auf dunklem Grund
T.paperMuted = "#B9B0A4";
T.error = "#A3261C";

const rows = [
  ["Dark Mode: Text auf erhöhter Fläche", T.paper, "#262220", 4.5],
  ["Dark Mode: gedämpfter Text", T.paperMuted, "#262220", 4.5],
  ["Dark Mode: Links und Fokus", T.accent, "#262220", 4.5],
  ["Dark Mode: Erfolg", "#9ac29d", "#262220", 4.5],
  ["Dark Mode: Fehler", "#ff9d8f", "#262220", 4.5],
  ["ink auf paper", T.ink, T.paper, 4.5],
  ["ink auf paper-2", T.ink, T.paper2, 4.5],
  ["ink-muted auf paper", T.inkMuted, T.paper, 4.5],
  ["ink-muted auf paper-2", T.inkMuted, T.paper2, 4.5],
  ["accent-text auf paper", T.accentText, T.paper, 4.5],
  ["accent-text auf paper-2", T.accentText, T.paper2, 4.5],
  ["ink auf accent (Primär-Button)", T.ink, T.accent, 4.5],
  // 2,93:1 → reicht nicht für Fokus/Text; daher nur dekorativ (Anriss, Maßketten, Flächen)
  ["accent auf paper – nur dekorativ (Anriss, Maßketten)", T.accent, T.paper, 1],
  ["Fokusrahmen hell: accent-text auf paper", T.accentText, T.paper, 3],
  ["Fokusrahmen/Links dunkel: accent auf ink", T.accent, T.ink, 4.5],
  ["paper auf ink", T.paper, T.ink, 4.5],
  ["paper-muted auf ink", T.paperMuted, T.ink, 4.5],
  ["walnut auf paper (nur Fläche)", T.walnut, T.paper, 3],
  ["line (14 % ink) auf paper – dekorativ", over(T.ink, 0.14, T.paper), T.paper, 1],
  ["Formular-Rahmen (ink-muted) auf paper", T.inkMuted, T.paper, 3],
  ["error auf paper (Fehlermeldungen)", T.error, T.paper, 4.5],
  ["error auf paper-2 (Fehlermeldungen)", T.error, T.paper2, 4.5],
  ["Fokusrahmen accent-text auf paper-2", T.accentText, T.paper2, 3],
];
console.log(`Tokens: ${JSON.stringify(T)}\n`);
console.log("| Kombination | Vordergrund | Hintergrund | Kontrast | Ziel | OK |\n|---|---|---|---|---|---|");
for (const [name, fg, bg, min] of rows) {
  const r = ratio(fg, bg);
  console.log(`| ${name} | \`${fg}\` | \`${bg}\` | ${r.toFixed(2)}:1 | ≥ ${min}:1 | ${r >= min ? "✓" : "✗"} |`);
}
