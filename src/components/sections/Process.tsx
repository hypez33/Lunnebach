"use client";

import Image from "next/image";
import { useRef } from "react";
import { img } from "@/content/images";
import { processHeadline, processSteps } from "@/content/process";
import { useMotion } from "@/lib/motion/useMotion";

/**
 * Moment 3 – Prozess „Vom Strich zum Schrank“.
 * Desktop + volle Bewegung: gepinnte Horizontal-Strecke (scrub: 1), Lineal füllt sich, Zähler „01 / 05“,
 * Bilder wechseln von Skizzen-Anmutung (Graustufen + Linien-Overlay) zu Farbe.
 * Mobil/reduziert/ohne JS: vertikale Abfolge (Reveals über PageMotion).
 * Keine Fokusfalle: Die Strecke enthält keine fokussierbaren Elemente.
 */
export function Process({ compact = false }: { compact?: boolean }) {
  const section = useRef<HTMLElement>(null);

  useMotion(
    ({ reduce, isDesktop, gsap, ScrollTrigger }) => {
      const root = section.current;
      if (!root || reduce || !isDesktop) return;

      const pin = root.querySelector<HTMLElement>(".process-pin")!;
      const viewport = root.querySelector<HTMLElement>(".process-viewport")!;
      const track = root.querySelector<HTMLElement>(".process-track")!;
      const steps = gsap.utils.toArray<HTMLElement>(".process-step", root);
      const fill = root.querySelector<HTMLElement>(".ruler-fill");
      const counter = root.querySelector<HTMLElement>(".process-counter-current");
      const n = steps.length;

      root.classList.add("process--horizontal");
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const setColor = (p: number) => {
        const pos = p * (n - 1);
        steps.forEach((s, i) => {
          const c = gsap.utils.clamp(0, 1, pos - i + 1);
          s.style.setProperty("--c", c.toFixed(3));
        });
        if (counter) counter.textContent = String(Math.min(n, Math.round(pos) + 1)).padStart(2, "0");
      };
      setColor(0);

      const tween = gsap.to(track, { x: () => -distance(), ease: "none" });
      if (fill) gsap.set(fill, { scaleX: 0 });

      const st = ScrollTrigger.create({
        trigger: root,
        pin,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setColor(self.progress);
          if (fill) gsap.set(fill, { scaleX: self.progress });
        },
      });

      return () => {
        st.kill();
        root.classList.remove("process--horizontal");
        steps.forEach((s) => s.style.removeProperty("--c"));
      };
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
              <span>{compact ? "Ablauf" : "04"}</span> <span aria-hidden>—</span> <span>Prozess</span>
            </p>
            <h2 id="process-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              {processHeadline}
            </h2>
          </div>
        </div>

        <div className="process-viewport relative">
          <ol className="process-track container-site relative">
            {processSteps.map((step, i) => {
              const image = img(step.image);
              return (
                <li key={step.number} className="process-step" style={{ ["--i" as string]: i }}>
                  <div className="process-step-text">
                    <p aria-hidden className="process-number font-display text-[clamp(5rem,4rem+6vw,11rem)] leading-[0.85] tracking-[-0.04em] text-accent [font-variation-settings:'opsz'_144,'SOFT'_100]">
                      {step.number}
                    </p>
                    <h3 className="mt-6 text-h3">
                      <span className="sr-only">Schritt {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[38ch] text-ink-muted">{step.text}</p>
                  </div>
                  <div data-clip="up" className="process-media grain relative overflow-hidden bg-paper-2" style={{ maxWidth: image.width }}>
                    <div className="relative" style={{ aspectRatio: image.height > image.width ? "4 / 5" : "4 / 3" }}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 560px, 92vw"
                        placeholder="blur"
                        blurDataURL={image.blurDataURL}
                        className="process-img object-cover"
                      />
                      <div aria-hidden className="process-sketch absolute inset-0" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Lineal / Zollstock mit Millimeter-Ticks */}
        <div aria-hidden className="process-ruler container-site relative">
          <div className="flex items-end justify-between gap-6">
            <p className="mono text-[0.8125rem] text-ink">
              <span className="process-counter-current">{String(processSteps.length).padStart(2, "0")}</span> / {String(processSteps.length).padStart(2, "0")}
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
