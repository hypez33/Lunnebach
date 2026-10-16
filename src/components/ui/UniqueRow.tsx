"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";

/** Rohling: ein stehendes Brett (gleiche Kontur für alle) */
const BLANK = "M30 12H70V108H30Z";

/** Aus jedem Rohling wird ein anderes Stück – Silhouetten als geschlossene Konturen (viewBox 0 0 100 120) */
const PIECES = [
  { name: "Stuhl", d: "M28 10H36V62H76V70H72V110H66V70H36V110H28Z", detail: "M36 30H30" },
  { name: "Tisch", d: "M10 50H90V58H82V110H76V58H24V110H18V58H10Z", detail: "M24 64H76" },
  { name: "Hocker", d: "M28 58H72V66H67L73 110H67L61 66H39L33 110H27L33 66H28Z", detail: "M36 88H64" },
  { name: "Kommode", d: "M16 38H84V100H80V110H74V100H26V110H20V100H16Z", detail: "M22 58H78M22 79H78M46 48h8M46 69h8M46 90h8" },
  { name: "Bank", d: "M6 72H94V80H88V110H82V80H18V110H12V80H6Z", detail: "M18 76H82" },
  { name: "Schrank", d: "M22 8H78V102H74V110H68V102H32V110H26V102H22Z", detail: "M50 12V98M45 50v14M55 50v14" },
];

/**
 * „Keine Serie. Nur Einzelstücke.“ als Bild: Sechs identische Rohlinge verwandeln sich beim Scrollen
 * nacheinander in sechs verschiedene Möbel (MorphSVG, scrub). Der Zähler läuft von „6 Rohlinge“ zu „6 Unikate“.
 * Dekorativ (aria-hidden). Ohne JS / reduziert: die fertigen Stücke. MorphSVG wird nur hier nachgeladen.
 */
export function UniqueRow({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      let cancelled = false;
      import("gsap/MorphSVGPlugin").then(({ MorphSVGPlugin }) => {
        if (cancelled) return;
        gsap.registerPlugin(MorphSVGPlugin);
        defer(() => {
          const items = gsap.utils.toArray<HTMLElement>(".unique-item", el);
          const count = el.querySelector<HTMLElement>(".unique-count")!;
          const word = el.querySelector<HTMLElement>(".unique-word")!;
          el.classList.add("unique--live");

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            // lange Strecke: die Verwandlung läuft, während die Reihe von unten bis ins obere Drittel wandert
            scrollTrigger: { trigger: el, start: "top 68%", end: "top 8%", scrub: 0.6 },
          });
          let done = -1;
          const setCount = (n: number) => {
            if (n === done) return;
            done = n;
            count.textContent = String(n === 0 ? PIECES.length : n);
            word.textContent = n === 0 ? "Rohlinge" : n === 1 ? "Unikat" : "Unikate";
          };
          items.forEach((item, i) => {
            const shape = item.querySelector("path.unique-shape")!;
            const grain = item.querySelectorAll(".unique-grain");
            const detail = item.querySelectorAll(".unique-detail");
            const label = item.querySelector<HTMLElement>(".unique-label")!;
            const at = i * 0.55;
            tl.fromTo(shape, { morphSVG: BLANK }, { morphSVG: PIECES[i].d, duration: 1 }, at)
              .fromTo(grain, { opacity: 1 }, { opacity: 0, duration: 0.3 }, at)
              .fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.3 }, at + 0.75)
              .call(
                () => {
                  // Richtung beachten: beim Zurückscrollen wieder „Rohling“
                  const forward = tl.scrollTrigger?.direction !== -1;
                  label.textContent = forward ? PIECES[i].name : "Rohling";
                  item.classList.toggle("is-done", forward);
                  setCount(forward ? i + 1 : i);
                },
                [],
                at + 0.5,
              );
            label.textContent = "Rohling";
          });
          setCount(0);
          return () => {
            el.classList.remove("unique--live");
            items.forEach((item, i) => {
              item.classList.remove("is-done");
              item.querySelector(".unique-label")!.textContent = PIECES[i].name;
            });
            count.textContent = String(PIECES.length);
            word.textContent = "Unikate";
          };
        });
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={`unique ${className}`}>
      <p className="unique-head mono">
        <span>Aus dem Rohling</span>
        <span>
          <span className="unique-count">{PIECES.length}</span> <span className="unique-word">Unikate</span>
        </span>
      </p>
      <ul className="unique-grid">
        {PIECES.map((p) => (
          <li key={p.name} className="unique-item is-done">
            <svg viewBox="0 0 100 120" className="unique-svg" focusable="false">
              <path className="unique-shape" d={p.d} fill="#c9a97f" stroke="#1c1916" strokeWidth="1.5" strokeLinejoin="round" />
              <path className="unique-grain" d="M36 30c6 10 4 30 10 46M52 18c-4 18 6 40 2 82M62 40c4 12 2 28 4 50" fill="none" stroke="#8a6a4a" strokeOpacity=".5" />
              <path className="unique-detail" d={p.detail} fill="none" stroke="#1c1916" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 114H96" stroke="#1c1916" strokeOpacity=".35" />
            </svg>
            <span className="unique-label mono">{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
