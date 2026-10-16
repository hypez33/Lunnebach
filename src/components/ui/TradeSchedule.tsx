"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";

/** Beispiel-Bauzeitenplan Ladenbau (illustrativ, s. TODO-CONTENT.md) */
const WEEKS = 11;
const ROWS = [
  { label: "Planung & Aufmaß", who: "Lunnebach", start: 0, len: 3 },
  { label: "Fertigung Werkstatt", who: "Lunnebach", start: 2, len: 5 },
  { label: "Elektro", who: "Partner", start: 4, len: 3 },
  { label: "Maler", who: "Partner", start: 6, len: 2 },
  { label: "Montage", who: "Lunnebach", start: 7, len: 3 },
  { label: "Übergabe", who: "Lunnebach", start: 10, len: 1 },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * „Alles aus einer Hand“ als Bauzeitenplan (dekorativ, aria-hidden – die Gewerke stehen als Liste daneben).
 * Eine „Heute“-Linie läuft beim Scrollen durch die Kalenderwochen (scrub); die Balken füllen sich bis zur
 * Linie, aktive Gewerke treten hervor, die Anzeige nennt, was parallel läuft. Darunter läuft „Ein
 * Ansprechpartner“ durchgehend mit. Mit Maus lässt sich die Linie über den Plan ziehen.
 * Ohne JS / reduziert: vollständiger Plan, keine Linie.
 */
export function TradeSchedule({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, canHover, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      defer(() => {
        el.classList.add("schedule--live");
        // Zeitachse = Spur einer Zeile (ohne Label-Spalte)
        const lane = el.querySelector<HTMLElement>(".schedule-track")!;
        const cursor = el.querySelector<HTMLElement>(".schedule-cursor")!;
        const week = el.querySelector<HTMLElement>(".schedule-week")!;
        const note = el.querySelector<HTMLElement>(".schedule-note")!;
        const rows = gsap.utils.toArray<HTMLElement>(".schedule-row", el);
        const bars = rows.map((r) => r.querySelector<HTMLElement>(".schedule-bar")!);
        const contact = el.querySelector<HTMLElement>(".schedule-contact .schedule-bar")!;

        // Zwei Quellen für die Position der Linie (in Wochen): Scroll (scrub) und Maus. Getrennte Objekte,
        // damit sich die Tweens nicht gegenseitig beenden.
        const fromScroll = { w: 0 };
        const fromPointer = { w: 0 };
        let usePointer = false;
        let lastNote = "";
        const render = () => {
          const w = usePointer ? fromPointer.w : fromScroll.w;
          cursor.style.transform = `translate3d(${((w / WEEKS) * lane.clientWidth).toFixed(1)}px,0,0)`;
          const active: string[] = [];
          ROWS.forEach((row, i) => {
            const f = gsap.utils.clamp(0, 1, (w - row.start) / row.len);
            bars[i].style.clipPath = `inset(0 ${((1 - f) * 100).toFixed(2)}% 0 0)`;
            const on = w > row.start && w < row.start + row.len;
            rows[i].classList.toggle("is-active", on);
            if (on) active.push(row.label.split(" ")[0]);
          });
          contact.style.clipPath = `inset(0 ${((1 - w / WEEKS) * 100).toFixed(2)}% 0 0)`;
          const kw = Math.min(WEEKS, Math.floor(w) + 1);
          const text =
            w >= WEEKS - 0.02
              ? "Übergeben · 6 Gewerke · 1 Ansprechpartner"
              : active.length > 1
                ? `${active.join(" + ")} parallel`
                : (active[0] ?? "Start");
          week.textContent = `KW ${pad(kw)}`;
          if (text !== lastNote) note.textContent = lastNote = text;
        };
        render();

        gsap.to(fromScroll, {
          w: WEEKS,
          ease: "none",
          onUpdate: () => !usePointer && render(),
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 38%", scrub: 0.7 },
        });

        if (!canHover) return;
        // Mit Maus: Linie über den Plan ziehen; beim Verlassen gleitet sie zurück zum Scroll-Stand
        const toPointer = gsap.quickTo(fromPointer, "w", { duration: 0.5, ease: "power3.out", onUpdate: render });
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          if (!usePointer) {
            fromPointer.w = fromScroll.w;
            usePointer = true;
          }
          const r = lane.getBoundingClientRect();
          toPointer(gsap.utils.clamp(0, WEEKS, ((e.clientX - r.left) / r.width) * WEEKS));
        };
        const onLeave = () => {
          if (!usePointer) return;
          gsap.to(fromPointer, {
            w: fromScroll.w,
            duration: 0.6,
            ease: "power3.out",
            overwrite: true,
            onUpdate: render,
            onComplete: () => void (usePointer = false),
          });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => {
        el.classList.remove("schedule--live");
        el.querySelectorAll<HTMLElement>(".schedule-bar, .schedule-cursor").forEach((n) => {
          n.style.removeProperty("clip-path");
          n.style.removeProperty("transform");
        });
        el.querySelectorAll(".schedule-row").forEach((r) => r.classList.remove("is-active"));
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={`schedule ${className}`}>
      <div className="schedule-head">
        <p className="mono text-[0.75rem] uppercase tracking-[0.1em] text-paper-muted">Beispiel · Bauzeitenplan Ladenbau</p>
        <p className="schedule-readout mono">
          <span className="schedule-week">KW {pad(WEEKS)}</span>
          <span className="schedule-note">11 Wochen · 6 Gewerke · 1 Ansprechpartner</span>
        </p>
      </div>

      <div className="schedule-grid">
        <div className="schedule-weeks">
          {Array.from({ length: WEEKS }, (_, i) => (
            <span key={i}>{pad(i + 1)}</span>
          ))}
        </div>
        <div className="schedule-lanes">
          {ROWS.map((row) => (
            <div key={row.label} className={`schedule-row ${row.who === "Partner" ? "is-partner" : ""}`}>
              <span className="schedule-label">
                {row.label}
                <span className="schedule-who mono">{row.who}</span>
              </span>
              <span className="schedule-track">
                <span
                  className="schedule-bar"
                  style={{ left: `${(row.start / WEEKS) * 100}%`, width: `${(row.len / WEEKS) * 100}%` }}
                />
              </span>
            </div>
          ))}
          <div className="schedule-row schedule-contact">
            <span className="schedule-label">
              Ein Ansprechpartner
              <span className="schedule-who mono">durchgehend</span>
            </span>
            <span className="schedule-track">
              <span className="schedule-bar" style={{ left: 0, width: "100%" }} />
            </span>
          </div>
          <span className="schedule-cursor" />
        </div>
      </div>
    </div>
  );
}
