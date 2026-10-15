/** Zentrale Eases und Dauern des Motion-Systems. CSS-Pendants in globals.css (@theme). */
export const EASE = {
  /** Streichmaß-Ease: ruhig rein, ruhig raus. Registriert via CustomEase in gsap.ts */
  lunnebach: "lunnebach",
  /** Für Reveals (Bilder, Zeilen) */
  reveal: "expo.out",
  out: "power3.out",
} as const;

export const LUNNEBACH_EASE_CURVE = "0.65, 0, 0.35, 1";

export const DURATION = {
  anriss: 0.9,
  door: 1.2,
  heroLines: 0.9,
  headline: 0.7,
  clip: 1.2,
  dimension: 0.9,
  count: 1.6,
  flip: 0.7,
} as const;

export const STAGGER = {
  lines: 0.08,
} as const;

/** ScrollTrigger-Startpunkte */
export const START = {
  headline: "top 85%",
  dimension: "top 75%",
  clip: "top 85%",
  count: "top 80%",
} as const;
