"use client";

import { useRef } from "react";
import { DURATION, EASE, MOBILE, STAGGER, START } from "@/lib/motion/eases";
import { useMotion } from "@/lib/motion/useMotion";

/**
 * Moment 1 – Hero „Anriss“.
 *  - Accent-Linie zieht von links über die Breite (DrawSVG, lunnebach-Ease)
 *  - Bildpanel öffnet wie eine Schiebetür (clip-path, expo.out) – Brücke zu Cabinet
 *  - Headline zeilenweise (SplitText, mask: lines)
 *  - Maßangabe an der Bildkante zeichnet sich
 * Desktop: Gesamtdauer < 1,8 s. Tür von rechts.
 * Mobil (< 1024 px, Hochformat): ≤ 1,4 s, kürzere Wege. Die Headline steht sofort (LCP-Element, gemessen),
 * Subline + CTAs steigen per CSS ab dem ersten Paint auf. Tür von unten nach oben; liegt das Bild beim Laden
 * unter dem Fold, öffnet sie sich beim Eintritt (sonst liefe der Effekt ungesehen ab). Beim Scrollen gleitet
 * das Bild samt Maßkette leicht parallax.
 * Reduziert/ohne JS: alles sofort sichtbar, Linie statisch.
 */
export function HeroMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, isDesktop, gsap, SplitText }) => {
      const root = scope.current;
      if (!root || reduce) return;

      const line = root.querySelectorAll("[data-hero-line] path");
      const door = root.querySelector<HTMLElement>("[data-hero-door]");
      const doorImg = door?.querySelector("img");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const dims = root.querySelectorAll<HTMLElement>("[data-hero-dim]");
      const fades = root.querySelectorAll<HTMLElement>("[data-hero-fade]");
      const parallax = root.querySelector<HTMLElement>("[data-hero-parallax]");

      const drawDims = (tl: gsap.core.Timeline, at: number, speed = 1) => {
        dims.forEach((d) => {
          gsap.set(d, { visibility: "visible" });
          const vertical = d.dataset.orientation === "vertical";
          tl.fromTo(d.querySelectorAll(".dim-path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.7 * speed, ease: EASE.lunnebach }, at)
            .fromTo(d.querySelectorAll(".dim-tick"), { scale: 0 }, { scale: 1, duration: 0.3 * speed, stagger: 0.05, ease: "back.out(2)" }, at + 0.4 * speed)
            .fromTo(
              d.querySelectorAll(".dim-label"),
              { autoAlpha: 0, [vertical ? "x" : "y"]: 6 },
              { autoAlpha: 1, x: 0, y: 0, duration: 0.4 * speed, ease: EASE.out },
              at + 0.45 * speed,
            );
        });
      };

      const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

      if (isDesktop) {
        tl.fromTo(line, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: DURATION.anriss, ease: EASE.lunnebach }, 0);
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
        drawDims(tl, 0.85);
        return;
      }

      // ---- Mobil: Hochformat-Choreografie --------------------------------------------------
      tl.fromTo(line, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: MOBILE.anriss, ease: EASE.lunnebach }, 0);
      // Headline steht sofort (LCP), Subline + CTAs laufen per CSS ab dem ersten Paint (globals.css, hero-rise)

      // Tür von unten nach oben, danach zeichnet sich die Maßkette „H 2 180“
      const openDoor = (t: gsap.core.Timeline, at: number) => {
        if (door) {
          t.fromTo(door, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: MOBILE.door }, at);
          if (doorImg) t.fromTo(doorImg, { scale: 1.06 }, { scale: 1, duration: MOBILE.door + 0.1, clearProps: "transform" }, at);
        }
        drawDims(t, at + 0.55, 0.7);
      };
      const doorTop = door?.getBoundingClientRect().top ?? 0;
      if (doorTop < window.innerHeight * 0.85) {
        openDoor(tl, 0.2);
      } else {
        const doorTl = gsap.timeline({
          defaults: { ease: EASE.reveal },
          scrollTrigger: { trigger: door, start: START.clip, once: true },
        });
        openDoor(doorTl, 0);
      }

      // Tiefe beim ersten Scrollen: Bild + Maßkette gleiten gemeinsam (scrub)
      if (parallax) {
        gsap.to(parallax, {
          yPercent: MOBILE.heroParallax,
          ease: "none",
          scrollTrigger: { trigger: root, start: 0, end: "bottom top", scrub: true },
        });
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
