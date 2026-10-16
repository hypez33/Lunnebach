"use client";

import { useId, useRef } from "react";
import { processSteps } from "@/content/process";
import { useMotion } from "@/lib/motion/useMotion";

const INK = "#1c1916";
const ACCENT = "#e46929";
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * „Vom ersten Strich bis zur letzten Schraube“ wörtlich: Ein Schrank entsteht beim Scrollen in fünf Stufen –
 *  01 Zuhören   Bleistiftskizze zeichnet sich
 *  02 Planen    Maßketten + Werte
 *  03 Anpassen  Einteilung, Rotstift-Korrektur, der Fachboden wandert an die bessere Stelle
 *  04 Fertigen  Holz wächst von unten in die Kontur
 *  05 Montieren Türen gleiten ein, Griffe, Schrauben
 * Das Werkstück bleibt stehen (sticky), die Schritte daneben laufen durch; der Trigger hängt an der Liste,
 * damit die Animation endet, solange alles im Bild ist. Ein Lineal darunter füllt sich mit.
 * Dekorativ (aria-hidden). Ohne JS / reduziert: fertiger Schrank.
 */
export function BuildPiece({ listSelector, className = "" }: { listSelector: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const clipId = `wood-${useId().replace(/:/g, "")}`;

  useMotion(
    ({ reduce, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      defer(() => {
        const svg = el.querySelector("svg")!;
        const q = (s: string) => svg.querySelectorAll(s);
        const list = document.querySelector<HTMLElement>(listSelector);
        if (!list) return;
        const steps = gsap.utils.toArray<HTMLElement>(":scope > li", list);
        const stageNo = el.querySelector<HTMLElement>(".build-stage-no")!;
        const stageTitle = el.querySelector<HTMLElement>(".build-stage-title")!;
        const fill = el.querySelector<HTMLElement>(".build-ruler-fill")!;
        el.classList.add("build--live");

        const tl = gsap.timeline({ defaults: { ease: "power1.inOut", duration: 1 }, paused: true });
        // 01 Skizze
        tl.fromTo(q(".b-sketch"), { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", stagger: 0.18, duration: 0.8 }, 0)
          // 02 Maße
          .fromTo(q(".b-dim path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.7 }, 1)
          .fromTo(q(".b-dim text"), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.35 }, 1.45)
          // 03 Anpassen: Einteilung, Korrektur, Fachboden wandert
          .fromTo(q(".b-inner"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", stagger: 0.15, duration: 0.5 }, 2)
          .fromTo(q(".b-fix"), { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", duration: 0.35 }, 2.45)
          .fromTo(q(".b-shelf-move"), { y: 0 }, { y: -12, duration: 0.4, ease: "power2.inOut" }, 2.6)
          // 04 Fertigen: Holz wächst von unten in die Kontur
          .fromTo(q(".b-wood-clip"), { attr: { y: 192, height: 0 } }, { attr: { y: 22, height: 170 }, duration: 0.8, ease: "power2.out" }, 3)
          .to(q(".b-sketch, .b-fix, .b-inner"), { opacity: 0, duration: 0.35 }, 3.45)
          // 05 Montieren: Türen gleiten ein, dann Griffe und Schrauben
          .fromTo(q(".b-door-a"), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 4)
          .fromTo(q(".b-door-b"), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 4.1)
          .fromTo(q(".b-handle"), { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.2, stagger: 0.06 }, 4.5)
          .fromTo(q(".b-screw"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, stagger: 0.04, duration: 0.2, ease: "back.out(3)" }, 4.65)
          .set({}, {}, 5);

        let current = -1;
        const sync = () => {
          const p = tl.progress();
          fill.style.transform = `scaleX(${p.toFixed(4)})`;
          const i = Math.min(steps.length - 1, Math.floor(p * 5 * 0.9999));
          if (i === current) return;
          current = i;
          steps.forEach((s, j) => s.classList.toggle("is-current", j === i));
          stageNo.textContent = `${processSteps[i].number} / ${pad(processSteps.length)}`;
          stageTitle.textContent = processSteps[i].title;
        };

        gsap.to(tl, {
          progress: 1,
          ease: "none",
          onUpdate: sync,
          // Liste, nicht Sektion: endet, wenn der letzte Schritt die Bildmitte erreicht
          scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 55%", scrub: 0.5 },
        });
        sync();

        return () => {
          el.classList.remove("build--live");
          steps.forEach((s) => s.classList.remove("is-current"));
          fill.style.removeProperty("transform");
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={`build ${className}`}>
      <svg viewBox="0 0 260 210" className="build-svg" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <rect className="b-wood-clip" x="40" y="22" width="180" height="170" />
          </clipPath>
        </defs>
        {/* 04 Holz (wächst von unten) */}
        <g clipPath={`url(#${clipId})`}>
          <rect x="60" y="24" width="130" height="160" fill="#a88762" />
          <path d="M66 40c30 6 60-4 118 4M66 92c40-6 70 6 118-2M66 150c34 5 70-5 118 3" stroke="#6f5338" strokeOpacity=".4" fill="none" />
          <rect x="60" y="24" width="130" height="160" fill="none" stroke={INK} strokeWidth="2" />
          <path d="M60 66h130M60 132h130" stroke={INK} strokeWidth="2" />
          <rect x="56" y="184" width="138" height="8" fill={INK} />
        </g>
        {/* 01 Skizze */}
        <path className="b-sketch" d="M61 25 L189 23 L191 183 L59 185 Z" fill="none" stroke={INK} strokeWidth="1.4" strokeDasharray="5 3" />
        <path className="b-sketch" d="M46 192 C 100 189, 160 195, 210 191" fill="none" stroke={INK} strokeWidth="1" />
        {/* 02 Maße */}
        <g className="b-dim" stroke={ACCENT} strokeWidth="1.3" fill={INK}>
          <path d="M60 10H190M60 5v10M190 5v10" fill="none" />
          <path d="M214 24V184M209 24h10M209 184h10" fill="none" />
          <text x="125" y="7" textAnchor="middle" fontSize="8" stroke="none" style={{ fontFamily: "var(--font-mono)" }}>
            1 300
          </text>
          <text x="222" y="108" fontSize="8" stroke="none" style={{ fontFamily: "var(--font-mono)" }}>
            1 600
          </text>
        </g>
        {/* 03 Einteilung + Korrektur: der obere Fachboden wandert nach oben */}
        <g className="b-shelf-move">
          <path className="b-inner" d="M60 78H190" stroke={INK} strokeWidth="1.4" fill="none" />
        </g>
        <path className="b-inner" d="M60 132H190" stroke={INK} strokeWidth="1.4" fill="none" />
        <path className="b-fix" d="M150 70c6-8 20-8 22 2s-12 14-22 6M160 84l-4 6" stroke="#a34b1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* 05 Türen, Griffe, Schrauben */}
        <g className="b-door-a">
          <rect x="61" y="25" width="64" height="158" fill="#b8996f" stroke={INK} strokeWidth="1.6" />
          <rect className="b-handle" x="115" y="88" width="3" height="34" fill={INK} />
        </g>
        <g className="b-door-b">
          <rect x="125" y="25" width="64" height="158" fill="#b8996f" stroke={INK} strokeWidth="1.6" />
          <rect className="b-handle" x="132" y="88" width="3" height="34" fill={INK} />
        </g>
        {[
          [67, 31],
          [183, 31],
          [67, 177],
          [183, 177],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} className="b-screw">
            <circle cx={cx} cy={cy} r="3" fill={ACCENT} />
            <path d={`M${cx - 2} ${cy}h4`} stroke={INK} strokeWidth="1" />
          </g>
        ))}
      </svg>
      <div className="build-meta">
        <p className="mono">
          <span className="build-stage-no">05 / 05</span> · <span className="build-stage-title">Montieren</span>
        </p>
        <div className="build-ruler">
          <span className="build-ruler-fill" />
        </div>
      </div>
    </div>
  );
}
