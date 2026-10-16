"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";

/** Länge des Bandes in mm (volle Breite) */
const LENGTH = 4200;
const fmt = (mm: number) => String(Math.round(mm / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/**
 * Maßband (dekorativ): Gehäuse links, Band mit Zentimeter-Teilung, Endhaken mit Anzeige in mm.
 * Beim Hereinscrollen zieht sich das Band heraus (scrub). Auf Geräten mit Maus folgt es danach dem Zeiger –
 * man „nimmt Maß“ über die Sektion. Ohne JS bzw. bei reduzierter Bewegung: voll ausgezogen, statisch.
 * Animiert werden nur clip-path und transform.
 */
export function TapeMeasure({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, canHover, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      defer(() => {
        const track = el.querySelector<HTMLElement>(".tape-track")!;
        const band = el.querySelector<HTMLElement>(".tape-band")!;
        const end = el.querySelector<HTMLElement>(".tape-end")!;
        const value = el.querySelector<HTMLElement>(".tape-value")!;
        el.classList.add("tape--live");

        const state = { p: 0 };
        let last = "";
        const render = () => {
          const p = state.p;
          band.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
          end.style.transform = `translate3d(${(p * track.clientWidth).toFixed(1)}px,0,0)`;
          const text = fmt(p * LENGTH);
          if (text !== last) value.textContent = last = text;
        };
        render();

        const pull = gsap.to(state, {
          p: 0.64,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 45%", scrub: 0.6 },
        });

        if (!canHover) return;
        const section = el.closest("section") ?? el;
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          // Ab der ersten Mausbewegung übernimmt der Zeiger
          if (pull.scrollTrigger) {
            pull.scrollTrigger.kill();
            pull.kill();
          }
          const r = track.getBoundingClientRect();
          const target = gsap.utils.clamp(0.04, 1, (e.clientX - r.left) / r.width);
          gsap.to(state, { p: target, duration: 0.7, ease: "power3.out", overwrite: true, onUpdate: render });
        };
        section.addEventListener("pointermove", onMove);
        return () => section.removeEventListener("pointermove", onMove);
      });
      return () => {
        el.classList.remove("tape--live");
        el.querySelector<HTMLElement>(".tape-band")?.style.removeProperty("clip-path");
        el.querySelector<HTMLElement>(".tape-end")?.style.removeProperty("transform");
        const v = el.querySelector(".tape-value");
        if (v) v.textContent = fmt(LENGTH);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={`tape ${className}`}>
      <div className="tape-case">
        <span className="tape-screw" />
      </div>
      <div className="tape-track">
        <div className="tape-band" />
        <div className="tape-end">
          <span className="tape-hook" />
          <span className="tape-readout mono">
            <span className="tape-value">{fmt(LENGTH)}</span> mm
          </span>
        </div>
      </div>
    </div>
  );
}
