"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/motion/gsap";
import { DURATION, EASE, STAGGER } from "@/lib/motion/eases";
import { useMotion } from "@/lib/motion/useMotion";

/**
 * Moment 1 – Hero „Anriss“.
 *  - Accent-Linie zieht von links über die Breite (DrawSVG, lunnebach-Ease)
 *  - Bildpanel öffnet wie eine Schiebetür (clip-path, expo.out) – Brücke zu Cabinet
 *  - Headline zeilenweise (SplitText, mask: lines)
 *  - Maßangabe an der Bildkante erscheint
 * Gesamtdauer < 1,8 s, blockiert keine Interaktion.
 * Mobil (< 1024 px): nur Linie + Maßkette, Inhalte sofort sichtbar (LCP).
 * Reduziert: alles sofort sichtbar, Linie statisch.
 */
export function HeroMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, isDesktop }) => {
      const root = scope.current;
      if (!root || reduce) return;

      const line = root.querySelectorAll("[data-hero-line] path");
      const door = root.querySelector<HTMLElement>("[data-hero-door]");
      const doorImg = door?.querySelector("img");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const dims = root.querySelectorAll<HTMLElement>("[data-hero-dim]");
      const fades = root.querySelectorAll<HTMLElement>("[data-hero-fade]");

      const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
      tl.fromTo(line, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: DURATION.anriss, ease: EASE.lunnebach }, 0);

      if (isDesktop) {
        if (door) {
          // Endzustand bleibt inline stehen (überschreibt die CSS-Startregel [data-hero-door])
          tl.fromTo(door, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.door }, 0.12);
          if (doorImg) tl.fromTo(doorImg, { xPercent: 8, scale: 1.06 }, { xPercent: 0, scale: 1, duration: DURATION.door + 0.2, clearProps: "transform" }, 0.12);
        }
        if (title) {
          const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.set(title, { visibility: "visible" });
          tl.from(split.lines, { yPercent: 110, duration: DURATION.heroLines, stagger: STAGGER.lines }, 0.2);
        }
        if (fades.length) {
          gsap.set(fades, { visibility: "visible" });
          tl.from(fades, { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: EASE.out }, 0.55);
        }
      }

      dims.forEach((d) => {
        gsap.set(d, { visibility: "visible" });
        const vertical = d.dataset.orientation === "vertical";
        tl.fromTo(d.querySelectorAll(".dim-path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.7, ease: EASE.lunnebach }, 0.85)
          .fromTo(d.querySelectorAll(".dim-tick"), { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }, 1.25)
          .fromTo(d.querySelectorAll(".dim-label"), { autoAlpha: 0, [vertical ? "x" : "y"]: 6 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.4, ease: EASE.out }, 1.3);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
