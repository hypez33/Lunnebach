"use client";

import { useRef } from "react";
import { ACTIVE_ZONE, DURATION, EASE, MOBILE, STAGGER, START } from "@/lib/motion/eases";
import { isInitiallyVisible, useMotion } from "@/lib/motion/useMotion";

const CLIP_FROM: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  door: "inset(0% 0% 0% 100%)",
};
const CLIP_OPEN = "inset(0% 0% 0% 0%)";

const nf = (decimals: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Globale, deklarative Scroll-Motion (Moment 2 + 5, Bild-Reveals, Touch-Gegenstücke zu Hover).
 * Server Components markieren Elemente per data-Attribut, diese Komponente verdrahtet sie:
 *  - [data-split]           Headline zeilenweise (SplitText, mask: lines); "hero" = Seiten-H1 beim Laden
 *  - [data-clip]            Bild-Reveal per clip-path (up | down | left | door); mit [data-clip-batch] gestaffelt
 *  - [data-dimension]       Maßkette zeichnet sich (DrawSVG)
 *  - [data-count]           Zahl zählt einmalig hoch
 *  - [data-active-in-view]  Touch: Klasse .is-active, solange das Element in der Bildmitte steht
 *                           (Gegenstück zu :hover; Hover-Maßketten der Projektkarten zeichnen sich dabei)
 *  - [data-parallax]        Touch: Bild gleitet im Rahmen (scrub, yPercent ±Wert)
 *  - [data-scrub-clip]      Touch: Bildausschnitt öffnet sich an den Scroll gekoppelt (Startwert = Attribut)
 *  - [data-mark]            Schlüsselwort in einer Überschrift wird mit Bleistiftstrich angerissen
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
    ({ reduce, isMobile, isTouch, defer, gsap, ScrollTrigger, SplitText }) => {
      if (reduce) return;
      const root = scope.current;
      if (!root) return;

      // Aufbau in mehreren Tasks (defer): Seiten-H1 sofort, alles unterhalb des Folds gestaffelt –
      // so entsteht nach dem Laden kein langer Task (TBT), und Eingaben bleiben flüssig (INP).

      // Moment 5 – Headlines. Mobil kürzerer Weg und schneller (Hochformat, LCP)
      const splitHeadline = (el: HTMLElement) => {
        const immediate = el.dataset.split === "hero";
        if (!immediate && isInitiallyVisible(el)) return;
        let played = false;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          // aria-label ist nur auf Überschriften erlaubt; Absätze (z. B. Zitate) bleiben unverändert lesbar
          aria: el.matches("h1, h2, h3, h4, h5, h6") ? "auto" : "none",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            if (played) return;
            const vars = isMobile
              ? { yPercent: MOBILE.linesY, opacity: 0, duration: MOBILE.lines, stagger: MOBILE.linesStagger }
              : { yPercent: 110, duration: immediate ? DURATION.heroLines : DURATION.headline, stagger: STAGGER.lines };
            return gsap.from(self.lines, {
              ...vars,
              ease: EASE.reveal,
              delay: immediate ? 0.1 : 0,
              onComplete: () => {
                played = true;
              },
              scrollTrigger: immediate ? undefined : { trigger: el, start: START.headline, once: true },
            });
          },
        });
      };
      const headlines = gsap.utils.toArray<HTMLElement>("[data-split]", root);
      headlines.filter((el) => el.dataset.split === "hero").forEach(splitHeadline);
      // je Headline ein Task – SplitText misst Zeilen (Layout), zusammen wäre das ein langer Task
      headlines.filter((el) => el.dataset.split !== "hero").forEach((el) => defer(() => splitHeadline(el)));

      // Bild-Reveals (nie Fade von 0, sondern clip-path)
      const clipDuration = isMobile ? MOBILE.clip : DURATION.clip;
      const revealTl = (el: HTMLElement) => {
        const from = CLIP_FROM[el.dataset.clip ?? "up"] ?? CLIP_FROM.up;
        const media = el.querySelector("img");
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(el, { clipPath: from }, { clipPath: CLIP_OPEN, duration: clipDuration, ease: EASE.reveal, clearProps: "clipPath" });
        if (media)
          tl.fromTo(media, { scale: 1.12 }, { scale: 1, duration: clipDuration * 1.2, ease: EASE.reveal, clearProps: "transform" }, 0);
        return tl;
      };
      defer(() => {
        const clips = gsap.utils
          .toArray<HTMLElement>("[data-clip]", root)
          // Prozess mobil: der Werkbank-Stapel hat ein eigenes Reveal (Skizze → Farbe)
          .filter((el) => !isInitiallyVisible(el) && !(isMobile && el.closest(".process")));
        clips
          .filter((el) => !el.closest("[data-clip-batch]"))
          .forEach((el) => {
            const tl = revealTl(el);
            ScrollTrigger.create({ trigger: el, start: START.clip, once: true, onEnter: () => tl.play() });
          });
        // Gestaffelt: was gleichzeitig ins Bild kommt (z. B. eine Galeriezeile), öffnet sich nacheinander
        const batched = clips.filter((el) => el.closest("[data-clip-batch]"));
        if (batched.length) {
          const tls = new Map(batched.map((el) => [el, revealTl(el)]));
          ScrollTrigger.batch(batched, {
            start: START.clip,
            once: true,
            onEnter: (els) =>
              els.forEach((el, i) => {
                const tl = tls.get(el as HTMLElement);
                if (tl) gsap.delayedCall(i * 0.12, () => void tl.play());
              }),
          });
        }
      });

      // Moment 2 – Maßketten
      const drawDimension = (el: HTMLElement, vars?: gsap.TimelineVars) => {
        const vertical = el.dataset.orientation === "vertical";
        const tl = gsap.timeline({ defaults: { ease: EASE.lunnebach }, ...vars });
        tl.fromTo(el.querySelectorAll(".dim-path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: DURATION.dimension })
          .fromTo(
            el.querySelectorAll(".dim-tick"),
            { scale: 0 },
            { scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(2)" },
            "-=0.35",
          )
          .fromTo(
            el.querySelectorAll(".dim-label"),
            { autoAlpha: 0, [vertical ? "x" : "y"]: 8 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: EASE.out },
            "-=0.3",
          );
        return tl;
      };
      defer(() =>
        root.querySelectorAll<HTMLElement>("[data-dimension]").forEach((el) => {
          if (el.dataset.dimension === "static") return;
          drawDimension(el, { scrollTrigger: { trigger: el, start: START.dimension, once: true } });
        }),
      );

      // Zahlen zählen einmalig hoch – auch wenn sie beim Laden schon im Bild sind (dann sofort)
      defer(() =>
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const to = Number(el.dataset.count);
          if (!Number.isFinite(to)) return;
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
        }),
      );

      if (isTouch)
        defer(() => {
          // „In-view active“: Hover-Zustand, solange das Element in der Bildmitte steht
          root.querySelectorAll<HTMLElement>("[data-active-in-view]").forEach((el) => {
            const dim = el.querySelector<HTMLElement>(".card-dim .dim");
            const draw = dim ? drawDimension(dim, { paused: true }) : null;
            ScrollTrigger.create({
              trigger: el,
              start: ACTIVE_ZONE.start,
              end: ACTIVE_ZONE.end,
              toggleClass: "is-active",
              onToggle: (self) => {
                if (!draw) return;
                if (self.isActive) draw.timeScale(1).play();
                else draw.timeScale(2.5).reverse();
              },
            });
          });

          // Parallax im Rahmen: überdimensioniert (scale), damit keine Kante sichtbar wird
          root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
            const amount = Number(el.dataset.parallax) || MOBILE.cardParallax;
            gsap.fromTo(
              el,
              { yPercent: -amount, scale: 1 + (amount * 2.4) / 100 },
              {
                yPercent: amount,
                ease: "none",
                scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                // eigene Ebene nur, solange sichtbar (kein Dauer-will-change)
                onToggle: (self) => void (el.style.willChange = self.isActive ? "transform" : ""),
              },
              },
            );
          });

          // Bildausschnitt öffnet sich proportional zum Scroll („an den Finger gekoppelt“)
          root.querySelectorAll<HTMLElement>("[data-scrub-clip]").forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: el.dataset.scrubClip || "inset(4% 4% 0% 4%)" },
              {
                clipPath: CLIP_OPEN,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top 92%", end: "center 50%", scrub: true },
              },
            );
          });
        });

      // Bleistift-Anriss unter einem Schlüsselwort ([data-mark]) – Klasse an der Überschrift, nicht am Wort,
      // weil SplitText die Wort-Spans beim Neuaufteilen ersetzt
      defer(() =>
        root.querySelectorAll<HTMLElement>("[data-mark]").forEach((mark) => {
          const heading = mark.closest<HTMLElement>("h1, h2, h3") ?? mark;
          if (isInitiallyVisible(heading)) return void heading.classList.add("is-marked");
          ScrollTrigger.create({ trigger: heading, start: "top 72%", once: true, onEnter: () => heading.classList.add("is-marked") });
        }),
      );

      // Zum Schluss einmal sortieren und messen (nach allen gestaffelten Gruppen)
      defer(() => {
        ScrollTrigger.sort();
        const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(raf);
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
