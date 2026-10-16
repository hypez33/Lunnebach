"use client";

import type { gsap as GSAP } from "gsap";

const NUM = /^(.*?)(\d{1,3}(?:[   ]\d{3})+|\d+)(\D*)$/;

/**
 * Zählt die letzte Zahl eines Maßketten-Labels hoch, während sich die Linie zeichnet
 * („B 5 200“: B 0 → B 5 200). Kleine Werte (< 100, z. B. „8 Bänke“) bleiben stehen.
 * Der Originaltext liegt in data-label, damit er beim Aufräumen wiederhergestellt werden kann.
 */
export function countLabel(gsap: typeof GSAP, label: Element, duration: number) {
  const el = label as HTMLElement;
  const text = el.dataset.label ?? el.textContent ?? "";
  el.dataset.label = text;
  const m = text.match(NUM);
  if (!m) return null;
  const [, pre, num, post] = m;
  const to = Number(num.replace(/\D/g, ""));
  if (!Number.isFinite(to) || to < 100) return null;
  const sep = num.match(/[   ]/)?.[0] ?? " ";
  const fmt = (v: number) => String(Math.round(v / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  const o = { v: 0 };
  return gsap.to(o, {
    v: to,
    duration,
    ease: "power2.out",
    onStart: () => void (el.textContent = pre + fmt(0) + post),
    onUpdate: () => void (el.textContent = pre + fmt(o.v) + post),
    onComplete: () => void (el.textContent = text),
  });
}

/** Stellt die Originaltexte aller hochgezählten Labels wieder her (Revert, Schalter „Bewegung reduzieren“) */
export function restoreLabels(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[data-label]").forEach((el) => {
    el.textContent = el.dataset.label ?? el.textContent;
  });
}
