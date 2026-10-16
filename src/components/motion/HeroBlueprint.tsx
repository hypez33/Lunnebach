"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";

const P = "#f4f1ec";
const A = "#e46929";
const mono = { fontFamily: "var(--font-mono)" } as const;

/**
 * „Röntgenblick“: Unter dem Hero-Foto liegt die Werkzeichnung der Vitrine (Blaupause, dekorativ).
 *  - Mit Maus: Eine Lupe folgt dem Zeiger und zeigt die Zeichnung darunter; kurz nach dem Laden kreist sie
 *    einmal von selbst als Hinweis.
 *  - Touch: Beim Scrollen fährt eine Scanlinie über das Bild und zeigt die Konstruktion in einem Band.
 * Ebene, Ring und Scanlinie lesen CSS-Variablen am Bildrahmen (--mx, --my, --r, --sy).
 * Ohne JS / reduziert: unsichtbar, das Foto bleibt unverändert.
 */
export function HeroBlueprint() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, canHover, defer, gsap }) => {
      const el = root.current;
      const host = el?.parentElement;
      if (!el || !host || reduce) return;
      const set = (k: string, v: string) => host.style.setProperty(k, v);

      defer(() => {
        if (canHover) {
          host.classList.add("bp-host", "bp--lens");
          const st = { x: 55, y: 35, r: 0 };
          const render = () => {
            set("--mx", `${st.x.toFixed(2)}%`);
            set("--my", `${st.y.toFixed(2)}%`);
            set("--r", `${st.r.toFixed(1)}px`);
          };
          render();
          // Hinweis: Lupe kreist einmal über das Bild
          const intro = gsap
            .timeline({ delay: 1.8, onUpdate: render })
            .to(st, { r: 92, duration: 0.5, ease: "power3.out" })
            .to(st, { x: 68, y: 26, duration: 0.8, ease: "power2.inOut" }, "<")
            .to(st, { x: 38, y: 58, duration: 1, ease: "power2.inOut" })
            .to(st, { r: 0, duration: 0.45, ease: "power2.in" });
          const toX = gsap.quickTo(st, "x", { duration: 0.45, ease: "power3.out", onUpdate: render });
          const toY = gsap.quickTo(st, "y", { duration: 0.45, ease: "power3.out", onUpdate: render });
          const onMove = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            toX(((e.clientX - r.left) / r.width) * 100);
            toY(((e.clientY - r.top) / r.height) * 100);
          };
          const onEnter = () => {
            intro.kill();
            gsap.to(st, { r: 110, duration: 0.5, ease: "power3.out", onUpdate: render, overwrite: "auto" });
          };
          const onLeave = () => gsap.to(st, { r: 0, duration: 0.4, ease: "power2.in", onUpdate: render, overwrite: "auto" });
          host.addEventListener("pointermove", onMove);
          host.addEventListener("pointerenter", onEnter);
          host.addEventListener("pointerleave", onLeave);
          return () => {
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerenter", onEnter);
            host.removeEventListener("pointerleave", onLeave);
            host.classList.remove("bp-host", "bp--lens");
          };
        }

        host.classList.add("bp-host", "bp--scan");
        const st = { p: 0 };
        const render = () => set("--sy", `${(st.p * 130 - 15).toFixed(2)}%`);
        render();
        gsap.to(st, {
          p: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: { trigger: host, start: "top 80%", end: "bottom 20%", scrub: 0.5 },
        });
        return () => host.classList.remove("bp-host", "bp--scan");
      });
    },
    { scope: root },
  );

  return (
    <>
      <div ref={root} aria-hidden className="bp">
        <svg viewBox="0 0 450 700" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <pattern id="bp-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M25 0H0V25" fill="none" stroke={P} strokeOpacity=".09" />
            </pattern>
            <pattern id="bp-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0V7" stroke={P} strokeOpacity=".45" />
            </pattern>
          </defs>
          <rect width="450" height="700" fill="url(#bp-grid)" />
          <g fill="none" stroke={P} strokeWidth="1.3">
            {/* Nische + Seitenwände (geschnitten, schraffiert) */}
            <rect x="60" y="40" width="330" height="620" />
            <rect x="60" y="40" width="30" height="580" fill="url(#bp-hatch)" />
            <rect x="360" y="40" width="30" height="580" fill="url(#bp-hatch)" />
            <rect x="60" y="620" width="330" height="40" fill="url(#bp-hatch)" />
            {/* Glasböden */}
            {[160, 280, 400, 520].map((y) => (
              <path key={y} d={`M90 ${y}H360M90 ${y + 5}H360`} strokeDasharray="7 4" />
            ))}
            {/* Maßketten */}
            <path d="M60 22H390M60 16v12M390 16v12" stroke={A} />
            <path d="M420 40V660M414 40h12M414 660h12" stroke={A} />
            {/* Detailkreis */}
            <circle cx="225" cy="282" r="22" stroke={A} strokeWidth="1.6" />
            <path d="M241 266L300 214H352" stroke={A} />
          </g>
          {/* LED-Leiste */}
          <path d="M100 52V610" stroke={A} strokeWidth="2.2" strokeDasharray="2 5" />
          <g fill={P} fontSize="12" style={mono}>
            <text x="225" y="13" textAnchor="middle">
              1 200
            </text>
            <text x="436" y="356" transform="rotate(90 436 356)" textAnchor="middle">
              H 2 180
            </text>
            <text x="300" y="208">Detail A</text>
            <text x="112" y="150">Glasboden ESG 8</text>
            <text x="112" y="100" fill={A}>
              LED 2 700 K
            </text>
            <text x="112" y="645">Sockel · Nussbaum</text>
          </g>
          <g style={mono}>
            <rect x="60" y="672" width="210" height="22" fill="none" stroke={P} strokeOpacity=".6" />
            <text x="68" y="687" fill={P} fontSize="10.5">
              Pos. 01 · Vitrine · M 1:20
            </text>
          </g>
        </svg>
      </div>
      <span aria-hidden className="bp-ring" />
      <span aria-hidden className="bp-scanline" />
    </>
  );
}
