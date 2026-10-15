"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/motion/gsap";
import { DURATION, EASE, STAGGER, START } from "@/lib/motion/eases";
import { isInitiallyVisible, useMotion } from "@/lib/motion/useMotion";

const CLIP_FROM: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  door: "inset(0% 0% 0% 100%)",
};

const nf = (decimals: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Globale, deklarative Scroll-Motion (Moment 2 + 5 und Bild-Reveals).
 * Server Components markieren Elemente per data-Attribut, diese Komponente verdrahtet sie:
 *  - [data-split]        Headline zeilenweise (SplitText, mask: lines)
 *  - [data-clip]         Bild-Reveal per clip-path (up | down | left | door)
 *  - [data-dimension]    Maßkette zeichnet sich (DrawSVG)
 *  - [data-count]        Zahl zählt einmalig hoch
 * Ohne JS bzw. bei reduzierter Bewegung bleibt alles statisch sichtbar.
 *
 * Wichtig: umschließt den Inhalt JEDER Seite (nicht im Layout):
 *  - Mit Cache Components hydriert das Seitensegment getrennt vom Layout; liefe der Code im Layout,
 *    würde er das DOM vor der Hydration der Seite verändern (Hydration-Mismatch).
 *  - Next hält besuchte Seiten versteckt im DOM (<Activity>); der Scope verhindert, dass Animationen
 *    an Elementen fremder (versteckter) Seiten hängen.
 */
export function PageMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, isDesktop }) => {
      if (reduce) return;
      const root = scope.current;
      if (!root) return;

      // Moment 5 – Sektionsheadlines
      root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        const immediate = el.dataset.split === "hero";
        // Seiten-H1 („hero“) nur auf Desktop animieren – mobil sofort sichtbar (LCP)
        if (immediate && !isDesktop) return;
        if (!immediate && isInitiallyVisible(el)) return;
        let played = false;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: immediate ? DURATION.heroLines : DURATION.headline,
              stagger: STAGGER.lines,
              ease: EASE.reveal,
              delay: immediate ? 0.1 : 0,
              onComplete: () => {
                played = true;
              },
              scrollTrigger: immediate ? undefined : { trigger: el, start: START.headline, once: true },
            });
          },
        });
      });

      // Bild-Reveals (nie Fade von 0, sondern clip-path)
      root.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
        if (isInitiallyVisible(el)) return;
        const from = CLIP_FROM[el.dataset.clip ?? "up"] ?? CLIP_FROM.up;
        const media = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START.clip, once: true } });
        tl.fromTo(
          el,
          { clipPath: from },
          { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.clip, ease: EASE.reveal, clearProps: "clipPath" },
        );
        if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, duration: DURATION.clip * 1.2, ease: EASE.reveal, clearProps: "transform" }, 0);
      });

      // Moment 2 – Maßketten
      root.querySelectorAll<HTMLElement>("[data-dimension]").forEach((el) => {
        if (el.dataset.dimension === "static") return;
        const path = el.querySelectorAll(".dim-path");
        const ticks = el.querySelectorAll(".dim-tick");
        const label = el.querySelectorAll(".dim-label");
        const vertical = el.dataset.orientation === "vertical";
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: START.dimension, once: true },
          defaults: { ease: EASE.lunnebach },
        });
        tl.fromTo(path, { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: DURATION.dimension })
          .fromTo(ticks, { scale: 0 }, { scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(2)" }, "-=0.35")
          .fromTo(
            label,
            { autoAlpha: 0, [vertical ? "x" : "y"]: 8 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: EASE.out },
            "-=0.3",
          );
      });

      // Zahlen zählen einmalig hoch
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        if (!Number.isFinite(to) || isInitiallyVisible(el)) return;
        const decimals = Number(el.dataset.decimals ?? 0);
        const fmt = nf(decimals);
        const prefix = el.dataset.prefix ?? "";
        const obj = { v: 0 };
        el.textContent = prefix + fmt.format(0);
        gsap.to(obj, {
          v: to,
          duration: DURATION.count,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: START.count, once: true },
          onUpdate: () => {
            el.textContent = prefix + fmt.format(obj.v);
          },
        });
      });

      ScrollTrigger.sort();
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
