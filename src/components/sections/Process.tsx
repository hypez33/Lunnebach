"use client";

import Image from "next/image";
import { useRef } from "react";
import { img } from "@/content/images";
import { processHeadline, processSteps } from "@/content/process";
import { useMotion } from "@/lib/motion/useMotion";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Moment 3 – Prozess „Vom Strich zum Schrank“.
 * Desktop + volle Bewegung: gepinnte Horizontal-Strecke (scrub: 1), Lineal füllt sich, Zähler „01 / 05“,
 * Bilder wechseln von Skizzen-Anmutung (Graustufen + Linien-Overlay) zu Farbe.
 * Mobil + volle Bewegung: „Werkbank-Stapel“ – die Schritte kleben als Karten (position: sticky) übereinander,
 * die verdeckte Karte tritt zurück (scale + Abdunklung), Bilder laufen von Skizze zu Farbe (Blend-Ebene statt
 * Filter), vertikales Lineal + Zähler am linken Rand. Kein Pinning, kein Scroll-Hijacking.
 * Reduziert/ohne JS/zu wenig Höhe: vertikale Liste, Lineal und Zähler ausgeblendet.
 * Keine Fokusfalle: Die Strecke enthält keine fokussierbaren Elemente.
 */
export function Process({ compact = false }: { compact?: boolean }) {
  const section = useRef<HTMLElement>(null);

  useMotion(
    ({ reduce, isDesktop, defer, gsap, ScrollTrigger }) => {
      const root = section.current;
      if (!root || reduce) return;

      const viewport = root.querySelector<HTMLElement>(".process-viewport")!;
      const track = root.querySelector<HTMLElement>(".process-track")!;
      const steps = gsap.utils.toArray<HTMLElement>(".process-step", root);
      const n = steps.length;

      // Unterhalb des Folds: eigener Task (kurze Tasks nach dem Laden)
      defer(isDesktop ? setupHorizontal : setupStack);

      /** Desktop: gepinnte Horizontal-Strecke */
      function setupHorizontal() {
        if (!root) return;
        const pin = root.querySelector<HTMLElement>(".process-pin")!;
        const fill = root.querySelector<HTMLElement>(".ruler-fill");
        const counter = root.querySelector<HTMLElement>(".process-ruler .process-counter-current");

        root.classList.add("process--horizontal");
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const setColor = (p: number) => {
          const pos = p * (n - 1);
          steps.forEach((s, i) => {
            const c = gsap.utils.clamp(0, 1, pos - i + 1);
            s.style.setProperty("--c", c.toFixed(3));
          });
          if (counter) counter.textContent = pad(Math.min(n, Math.round(pos) + 1));
        };
        setColor(0);

        // Strecke, Lineal-Füllung, Farben und Zähler hängen an DERSELBEN gedämpften Timeline (scrub: 1) –
        // vorher folgte die Füllung dem rohen Scroll und lief der gedämpften Strecke ruckelnd voraus.
        const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: () => setColor(tl.progress()) });
        tl.to(track, { x: () => -distance() }, 0);
        if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1 }, 0);

        const st = ScrollTrigger.create({
          trigger: root,
          pin,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          animation: tl,
          invalidateOnRefresh: true,
        });

        return () => {
          st.kill();
          root.classList.remove("process--horizontal");
          steps.forEach((s) => s.style.removeProperty("--c"));
        };
      }

      /** Mobil: Werkbank-Stapel. Ein einziger Scroll-Handler steuert alle Karten. */
      function setupStack() {
        if (!root || !CSS.supports("position", "sticky")) return;
        root.classList.add("process--stack");

        const stickyTop = (el: HTMLElement) => parseFloat(getComputedStyle(el).top) || 0;
        // Passt jede Karte samt Versatz in die (kleinste) Viewport-Höhe? Sonst bleibt die Liste.
        const fits = steps.every((s) => s.offsetHeight + stickyTop(s) + 12 <= window.innerHeight);
        if (!fits) {
          root.classList.remove("process--stack");
          return;
        }

        const vfill = root.querySelector<HTMLElement>(".vruler-fill");
        const vcounter = root.querySelector<HTMLElement>(".process-vruler .process-counter-current");
        const setters = steps.map((s) => ({
          scale: gsap.quickSetter(s, "scale"),
          shade: gsap.quickSetter(s.querySelector(".process-shade"), "opacity"),
          desat: gsap.quickSetter(s.querySelector(".process-desat"), "opacity"),
          sketch: gsap.quickSetter(s.querySelector(".process-sketch"), "opacity"),
        }));
        // geglättet statt hart gesetzt: Wheel-/Touch-Scroll kommt in Sprüngen, das Lineal soll gleiten
        const setFill = vfill ? gsap.quickTo(vfill, "scaleY", { duration: 0.45, ease: "power3.out" }) : null;
        const clamp = gsap.utils.clamp(0, 1);

        // Natürliche Lage der Karten (ohne Sticky-Versatz) aus dem Layout: Höhen + Abstand
        let natural: number[] = [];
        let tops: number[] = [];
        let vh = window.innerHeight;
        const measure = () => {
          vh = window.innerHeight;
          const cs = getComputedStyle(track);
          const gap = parseFloat(cs.rowGap) || 0;
          let y = track.getBoundingClientRect().top + window.scrollY + (parseFloat(cs.paddingTop) || 0);
          natural = steps.map((s) => {
            const top = y;
            y += s.offsetHeight + gap;
            return top;
          });
          tops = steps.map(stickyTop);
        };

        let lastCount = -1;
        const update = (y: number) => {
          let count = 0;
          steps.forEach((_, i) => {
            const stuckAt = natural[i] - tops[i];
            // Skizze → Farbe, während die Karte in Position kommt
            const colorFrom = natural[i] - vh * 0.9;
            const c = clamp((y - colorFrom) / Math.max(1, stuckAt - colorFrom));
            setters[i].desat(1 - c);
            setters[i].sketch((1 - c) * 0.85);
            if (y >= stuckAt - 2) count = i + 1;
            // Wird von der nächsten Karte überdeckt → zurücktreten
            if (i < n - 1) {
              // erst auf dem letzten Stück, bevor die nächste Karte einrastet (nicht schon beim Eintritt unten)
              const nextEnter = natural[i + 1] - tops[i + 1] - vh * 0.4;
              const nextStuck = natural[i + 1] - tops[i + 1];
              const p = clamp((y - nextEnter) / Math.max(1, nextStuck - nextEnter));
              setters[i].scale(1 - 0.05 * p);
              setters[i].shade(0.14 * p);
            }
          });
          const first = natural[0] - tops[0];
          const last = natural[n - 1] - tops[n - 1];
          setFill?.(clamp((y - first + vh * 0.35) / Math.max(1, last - first + vh * 0.35)));
          const shown = Math.max(1, count);
          if (vcounter && shown !== lastCount) {
            vcounter.textContent = pad(shown);
            lastCount = shown;
          }
        };

        measure();
        const st = ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onRefresh: (self) => {
            measure();
            update(self.scroll());
          },
          onUpdate: (self) => update(self.scroll()),
        });
        update(window.scrollY);

        return () => {
          st.kill();
          root.classList.remove("process--stack");
          steps.forEach((s) => {
            gsap.set([s, ...s.querySelectorAll(".process-shade, .process-desat, .process-sketch")], { clearProps: "transform,opacity" });
          });
          if (vfill) gsap.set(vfill, { clearProps: "transform" });
          if (vcounter) vcounter.textContent = "01";
        };
      }
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="process-title" className="process relative border-t border-line">
      <div className="process-pin relative">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="process-head container-site relative">
          <div className="grid-12 gap-y-6">
            <p className="eyebrow col-span-4 flex gap-3 text-ink-muted md:col-span-8 lg:col-span-3">
              {compact ? "Ablauf" : "Prozess"}
            </p>
            <h2 id="process-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              {processHeadline}
            </h2>
          </div>
        </div>

        <div className="process-viewport relative">
          {/* Mobil: vertikales Lineal mit Zähler (nur im Stapel-Modus sichtbar) */}
          <div aria-hidden className="process-vruler">
            <p className="process-vcounter mono text-[0.75rem] text-ink">
              <span className="process-counter-current">01</span> / {pad(processSteps.length)}
            </p>
            <div className="vruler-bar">
              <div className="vruler-fill" />
              <div className="vruler-ticks" />
            </div>
          </div>

          <ol className="process-track container-site relative">
            {processSteps.map((step, i) => {
              const image = img(step.image);
              return (
                <li key={step.number} className="process-step" style={{ ["--i" as string]: i }}>
                  <div className="process-step-text">
                    <p
                      aria-hidden
                      className="process-number font-display text-[clamp(5rem,4rem+6vw,11rem)] leading-[0.85] tracking-[-0.04em] text-accent [font-variation-settings:'opsz'_144,'SOFT'_100]"
                    >
                      {step.number}
                    </p>
                    <h3 className="mt-6 text-h3">
                      <span className="sr-only">Schritt {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[38ch] text-ink-muted">{step.text}</p>
                  </div>
                  <div data-clip="up" className="process-media grain relative overflow-hidden bg-paper-2" style={{ maxWidth: image.width }}>
                    <div className="process-frame relative" style={{ aspectRatio: image.height > image.width ? "4 / 5" : "4 / 3" }}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 560px, 92vw"
                        placeholder="blur"
                        blurDataURL={image.blurDataURL}
                        className="process-img object-cover"
                      />
                      <div aria-hidden className="process-desat absolute inset-0" />
                      <div aria-hidden className="process-sketch absolute inset-0" />
                    </div>
                  </div>
                  <div aria-hidden className="process-shade" />
                </li>
              );
            })}
          </ol>
        </div>

        {/* Desktop: Lineal / Zollstock mit Millimeter-Ticks (nur in der Horizontal-Strecke sichtbar) */}
        <div aria-hidden className="process-ruler container-site relative">
          <div className="flex items-end justify-between gap-6">
            <p className="mono text-[0.8125rem] text-ink">
              <span className="process-counter-current">01</span> / {pad(processSteps.length)}
            </p>
            <p className="mono text-[0.75rem] text-ink-muted">mm</p>
          </div>
          <div className="ruler relative mt-3 h-7 overflow-hidden bg-paper-2">
            <div className="ruler-fill absolute inset-0 origin-left bg-accent" />
            <div className="ruler-ticks absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
