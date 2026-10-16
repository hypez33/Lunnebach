"use client";

import { useRef } from "react";
import { processSteps } from "@/content/process";
import { useMotion } from "@/lib/motion/useMotion";

/**
 * „Vom ersten Strich bis zur letzten Schraube“ wörtlich: Ein Schrank entsteht beim Scrollen in fünf Stufen –
 * Skizze (Zuhören), Maße (Planen), Einteilung + Korrektur (Anpassen), Holz (Fertigen), Türen, Griffe und
 * Schrauben (Montieren). Der passende Schritt in der Liste darunter tritt hervor (.is-current).
 * Dekorativ (aria-hidden). Ohne JS / reduziert: fertiger Schrank, alle Schritte gleich.
 */
export function BuildPiece({ listSelector }: { listSelector: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      defer(() => {
        const svg = el.querySelector("svg")!;
        const q = (s: string) => svg.querySelectorAll(s);
        const steps = gsap.utils.toArray<HTMLElement>(`${listSelector} > li`);
        const stage = el.querySelector<HTMLElement>(".build-stage")!;
        el.classList.add("build--live");

        const tl = gsap.timeline({ defaults: { ease: "none", duration: 1 }, paused: true });
        // 1 Skizze: Bleistiftkontur zeichnet sich
        tl.fromTo(q(".b-sketch"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", stagger: 0.15 }, 0)
          // 2 Maße: Maßketten + Werte
          .fromTo(q(".b-dim path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%" }, 1)
          .fromTo(q(".b-dim text"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
          // 3 Anpassen: Einteilung + Rotstift-Korrektur
          .fromTo(q(".b-inner"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", stagger: 0.2 }, 2)
          .fromTo(q(".b-fix"), { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", duration: 0.5 }, 2.4)
          // 4 Fertigen: Holz statt Strich
          .fromTo(q(".b-wood"), { opacity: 0 }, { opacity: 1 }, 3)
          .to(q(".b-sketch"), { opacity: 0, duration: 0.5 }, 3.3)
          .to(q(".b-fix"), { opacity: 0, duration: 0.4 }, 3.3)
          // 5 Montieren: Türen schließen, Griffe, Schrauben
          .fromTo(q(".b-door"), { scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, stagger: 0.15, duration: 0.6 }, 4)
          .fromTo(q(".b-screw"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, stagger: 0.05, duration: 0.3, ease: "back.out(3)" }, 4.5);

        let current = -1;
        const setStep = (p: number) => {
          const i = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
          if (i === current) return;
          current = i;
          steps.forEach((s, j) => s.classList.toggle("is-current", j === i));
          stage.textContent = `${processSteps[i].number} / ${String(processSteps.length).padStart(2, "0")} · ${processSteps[i].title}`;
        };

        gsap.to(tl, {
          progress: 1,
          ease: "none",
          onUpdate: () => setStep(tl.progress()),
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top 60%",
            end: "bottom 75%",
            scrub: 0.6,
          },
        });
        setStep(0);

        return () => {
          el.classList.remove("build--live");
          steps.forEach((s) => s.classList.remove("is-current"));
          tl.progress(1).kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="build">
      <svg viewBox="0 0 260 210" className="build-svg" focusable="false">
        {/* 4 Holz */}
        <g className="b-wood">
          <rect x="60" y="24" width="130" height="160" fill="#a88762" />
          <path d="M66 40c30 6 60-4 118 4M66 92c40-6 70 6 118-2M66 150c34 5 70-5 118 3" stroke="#6f5338" strokeOpacity=".35" fill="none" />
          <rect x="60" y="24" width="130" height="160" fill="none" stroke="#1c1916" strokeWidth="2" />
          <path d="M60 78h130M60 132h130" stroke="#1c1916" strokeWidth="2" />
          <rect x="56" y="184" width="138" height="8" fill="#1c1916" />
        </g>
        {/* 1 Skizze */}
        <path className="b-sketch" d="M61 25 L189 23 L191 183 L59 185 Z" fill="none" stroke="#1c1916" strokeWidth="1.4" strokeDasharray="5 3" />
        <path className="b-sketch" d="M50 192 C 100 190, 160 194, 205 191" fill="none" stroke="#1c1916" strokeWidth="1" />
        {/* 2 Maße */}
        <g className="b-dim" stroke="#e46929" strokeWidth="1.3" fill="#1c1916">
          <path d="M60 10H190M60 5v10M190 5v10" fill="none" />
          <path d="M214 24V184M209 24h10M209 184h10" fill="none" />
          <text x="125" y="7" textAnchor="middle" fontSize="8" style={{ fontFamily: "var(--font-mono)" }} stroke="none">
            1 300
          </text>
          <text x="222" y="108" fontSize="8" style={{ fontFamily: "var(--font-mono)" }} stroke="none">
            1 600
          </text>
        </g>
        {/* 3 Einteilung + Korrektur */}
        <path className="b-inner" d="M60 78H190" stroke="#1c1916" strokeWidth="1.4" fill="none" />
        <path className="b-inner" d="M60 132H190" stroke="#1c1916" strokeWidth="1.4" fill="none" />
        <path className="b-fix" d="M120 100c10-12 32-10 34 4s-20 22-34 10" stroke="#a34b1c" strokeWidth="1.6" fill="none" />
        {/* 5 Türen, Griffe, Schrauben */}
        <g className="b-door">
          <rect x="61" y="25" width="64" height="158" fill="#b8996f" stroke="#1c1916" strokeWidth="1.6" />
          <rect x="116" y="88" width="3" height="34" fill="#1c1916" />
        </g>
        <g className="b-door">
          <rect x="125" y="25" width="64" height="158" fill="#b8996f" stroke="#1c1916" strokeWidth="1.6" />
          <rect x="131" y="88" width="3" height="34" fill="#1c1916" />
        </g>
        {[
          [67, 31],
          [183, 31],
          [67, 177],
          [183, 177],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} className="b-screw">
            <circle cx={cx} cy={cy} r="3" fill="#e46929" />
            <path d={`M${cx - 2} ${cy}h4`} stroke="#1c1916" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <p className="build-stage mono">05 / 05 · Montieren</p>
    </div>
  );
}
