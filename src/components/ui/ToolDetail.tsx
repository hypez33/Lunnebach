"use client";

import { useId, useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";

const INK = "#1c1916";
const WOOD = "#c9a97f";
const WOOD_DARK = "#a88762";
const WALNUT = "#8a6a4a";
const PAPER = "#f4f1ec";
const ACCENT = "#e46929";
const MUTED = "#b9b0a4";

type Q = (s: string) => NodeListOf<SVGElement>;
type Kind = {
  label: string;
  /** SVG-Inhalt (viewBox 0 0 280 150); uid für eindeutige clipPath-IDs */
  draw: (uid: string) => React.ReactNode;
  /** Scrub-Timeline (Dauer 1 = ganze Strecke) */
  build: (tl: gsap.core.Timeline, q: Q) => void;
};

const s = { stroke: INK, strokeWidth: 1.4 } as const;

// ---- Einbau: Module unter der Dachschräge -------------------------------------------------
const slopeY = (x: number) => 20 + (x - 40) * (90 / 210);
const modules = [0, 1, 2, 3].map((i) => {
  const x0 = 44 + i * 51;
  const x1 = x0 + 48;
  return { x0, x1, y0: slopeY(x0) + 4, y1: slopeY(x1) + 4 };
});

// ---- Wohnen: Bücher -----------------------------------------------------------------------
const BOOK_COLORS = [WALNUT, INK, ACCENT, MUTED, WOOD_DARK, INK, WALNUT];
const books = Array.from({ length: 18 }, (_, i) => {
  const row = Math.floor(i / 6);
  const k = i % 6;
  const w = [9, 12, 8, 14, 10, 11][(i * 7) % 6];
  const h = [30, 34, 26, 32, 28, 33][(i * 5) % 6];
  return { row, k, w, h, color: BOOK_COLORS[i % BOOK_COLORS.length] };
});

const KINDS: Record<string, Kind> = {
  kuechen: {
    label: "Hochklappen & Licht",
    draw: () => (
      <>
        {[30, 104, 178].map((x) => (
          <rect key={x} x={x} y="18" width="72" height="40" fill={PAPER} {...s} />
        ))}
        {/* Inhalt hinter den Klappen: Teller und Gläser */}
        {[30, 104, 178].map((x) => (
          <g key={`c-${x}`}>
            <path d={`M${x} 38h72`} stroke={INK} strokeWidth="1" />
            {[10, 22, 34].map((dx) => (
              <ellipse key={dx} cx={x + dx} cy="33" rx="5" ry="4.5" fill="none" stroke={INK} strokeWidth="1" />
            ))}
            {[50, 58, 66].map((dx) => (
              <rect key={dx} x={x + dx - 2.5} y="45" width="5" height="11" rx="1" fill="none" stroke={INK} strokeWidth="1" />
            ))}
          </g>
        ))}
        <polygon className="k-light" points="34,58 248,58 262,94 20,94" fill={ACCENT} opacity="0.3" />
        {[30, 104, 178].map((x) => (
          <rect key={x} className="k-flap" x={x} y="18" width="72" height="40" fill={WOOD} {...s} />
        ))}
        <rect className="k-top" x="18" y="94" width="244" height="6" fill={INK} />
        {[22, 82, 142, 202].map((x, i) => (
          <g key={x} className="k-base">
            <rect x={x} y="102" width="58" height="38" fill={WOOD_DARK} {...s} />
            <path d={i % 2 ? `M${x + 8} 121h42` : `M${x + 8} 109h42M${x + 8} 121h42M${x + 8} 133h42`} stroke={INK} strokeWidth="1" />
          </g>
        ))}
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".k-base"), { y: 10, opacity: 0, stagger: 0.06, duration: 0.25 }, 0)
        .from(q(".k-top"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.25 }, 0.2)
        .to(q(".k-flap"), { scaleY: 0.16, transformOrigin: "50% 0%", stagger: 0.08, duration: 0.3, ease: "power2.inOut" }, 0.45)
        .from(q(".k-light"), { opacity: 0, duration: 0.25 }, 0.72);
    },
  },

  wohnen: {
    label: "Bücherwand",
    draw: () => (
      <>
        <rect x="40" y="10" width="200" height="132" fill="none" stroke={INK} strokeWidth="2" />
        {[54, 98].map((y) => (
          <path key={y} d={`M40 ${y}H240`} stroke={INK} strokeWidth="2" />
        ))}
        {books.map((b, i) => {
          const base = [54, 98, 142][b.row];
          const x = 46 + books.filter((o, j) => o.row === b.row && j < i).reduce((a, o) => a + o.w + 2, 0) + b.row * 8;
          return <rect key={i} className={`w-book${i === 17 ? " w-last" : ""}`} x={x} y={base - b.h} width={b.w} height={b.h} fill={b.color} />;
        })}
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".w-book"), { y: -36, opacity: 0, stagger: 0.035, duration: 0.18, ease: "power2.in" }, 0).to(
        q(".w-last"),
        { rotation: -14, transformOrigin: "0% 100%", duration: 0.2, ease: "back.out(2)" },
        0.82,
      );
    },
  },

  einbau: {
    label: "Dachschräge",
    draw: () => (
      <>
        <path className="e-line" d={`M40 140V20L250 ${slopeY(250)}V140`} fill="none" stroke={INK} strokeWidth="2" />
        <path d="M30 140H262" stroke={INK} strokeWidth="2" />
        {modules.map((m, i) => (
          <g key={i} className="e-mod">
            <polygon points={`${m.x0},${m.y0} ${m.x1},${m.y1} ${m.x1},138 ${m.x0},138`} fill={WOOD} {...s} />
            <rect x={m.x1 - 8} y={(m.y1 + 138) / 2 - 8} width="2.5" height="16" fill={INK} />
          </g>
        ))}
        <path className="e-ref" d="M40 20H118" fill="none" stroke={ACCENT} strokeWidth="1.2" strokeDasharray="3 3" />
        <path className="e-arc" d="M100 20 A 60 60 0 0 1 95.2 43.6" fill="none" stroke={ACCENT} strokeWidth="1.8" />
        <text className="e-deg" x="104" y="35" fontSize="11" fill={INK} style={{ fontFamily: "var(--font-mono)" }}>
          23°
        </text>
      </>
    ),
    build: (tl, q) => {
      tl.fromTo(q(".e-line"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.3 }, 0)
        .from(q(".e-mod"), { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.1, duration: 0.3, ease: "power3.out" }, 0.25)
        .fromTo(q(".e-ref"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.15 }, 0.6)
        .fromTo(q(".e-arc"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.15 }, 0.68)
        .from(q(".e-deg"), { opacity: 0, x: -4, duration: 0.12 }, 0.75);
    },
  },

  bad: {
    label: "Waschtisch",
    draw: (uid) => (
      <>
        <defs>
          <clipPath id={`m-${uid}`}>
            <rect x="96" y="12" width="88" height="48" rx="2" />
          </clipPath>
        </defs>
        <rect x="96" y="12" width="88" height="48" rx="2" fill="#dfe3e1" {...s} />
        <g clipPath={`url(#m-${uid})`}>
          <path className="b-glare" d="M70 70L110 0h14L84 70Z" fill="#fff" opacity="0.8" />
        </g>
        <path d="M150 74v-8h-14" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <rect x="62" y="80" width="156" height="8" fill={PAPER} {...s} />
        <ellipse cx="140" cy="84" rx="26" ry="2.5" fill="#cfd5d3" />
        <ellipse className="b-ripple" cx="140" cy="84" rx="16" ry="2.6" fill="none" stroke={ACCENT} strokeWidth="1.8" />
        <ellipse className="b-ripple" cx="140" cy="84" rx="9" ry="1.6" fill="none" stroke={ACCENT} strokeWidth="1.4" />
        <path className="b-drop" d="M134.5 69c0 3.4 2.4 5.6 5.5 5.6s5.5-2.2 5.5-5.6c0-3.8-5.5-9.6-5.5-9.6s-5.5 5.8-5.5 9.6Z" fill={ACCENT} />
        <rect className="b-vanity" x="72" y="88" width="136" height="40" fill={WOOD} {...s} />
        <path className="b-vanity" d="M80 108h120" stroke={INK} strokeWidth="1" />
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".b-vanity"), { y: 14, opacity: 0, duration: 0.25 }, 0)
        .fromTo(q(".b-glare"), { x: -40 }, { x: 110, duration: 0.45, ease: "power1.inOut" }, 0.15)
        .fromTo(q(".b-drop"), { y: -6, opacity: 0 }, { y: 10, opacity: 1, duration: 0.25, ease: "power2.in" }, 0.5)
        .to(q(".b-drop"), { opacity: 0, duration: 0.05 }, 0.75)
        .fromTo(q(".b-ripple"), { scale: 0.2, opacity: 1, transformOrigin: "50% 50%" }, { scale: 1.7, opacity: 0, duration: 0.25, stagger: 0.06 }, 0.75);
    },
  },

  outdoor: {
    label: "Terrassendielen",
    draw: (uid) => (
      <>
        <defs>
          <clipPath id={`d-${uid}`}>
            <rect x="30" y="14" width="220" height="122" />
          </clipPath>
        </defs>
        {[60, 140, 220].map((x) => (
          <rect key={x} className="o-joist" x={x - 4} y="10" width="8" height="130" fill={WALNUT} />
        ))}
        <g clipPath={`url(#d-${uid})`}>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} className="o-board" x="30" y={16 + i * 17} width="220" height="14" fill={i % 2 ? WOOD : WOOD_DARK} {...s} />
          ))}
        </g>
        {Array.from({ length: 7 }, (_, i) =>
          [60, 140, 220].map((x) => <circle key={`${i}-${x}`} className="o-screw" cx={x} cy={23 + i * 17} r="1.8" fill={INK} />),
        )}
        <circle className="o-sun" cx="262" cy="20" r="9" fill={ACCENT} />
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".o-joist"), { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.05, duration: 0.15 }, 0)
        .from(q(".o-board"), { x: -230, stagger: 0.06, duration: 0.22, ease: "power3.out" }, 0.15)
        .from(q(".o-screw"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.008, duration: 0.08 }, 0.65)
        .from(q(".o-sun"), { y: 24, opacity: 0, duration: 0.3 }, 0.6);
    },
  },

  ladenbau: {
    label: "Regalwand",
    draw: () => (
      <>
        <rect x="30" y="8" width="220" height="104" fill="none" stroke={INK} strokeWidth="2" />
        {[42, 76].map((y) => (
          <path key={y} d={`M30 ${y}H250`} stroke={INK} strokeWidth="2" />
        ))}
        {[85, 140, 195].map((x) => (
          <path key={x} d={`M${x} 8V112`} stroke={INK} strokeWidth="1.2" />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const bx = 38 + col * 55;
          const base = [42, 76, 110][row];
          const tall = (i * 3) % 4 === 0;
          return (
            <g key={i} className="l-item">
              <rect x={bx} y={base - (tall ? 24 : 16)} width="12" height={tall ? 24 : 16} rx="2" fill={[WOOD_DARK, PAPER, ACCENT, MUTED][i % 4]} {...s} strokeWidth="1" />
              <rect x={bx + 16} y={base - 14} width="14" height="14" rx="2" fill={[MUTED, WOOD, PAPER, WALNUT][i % 4]} {...s} strokeWidth="1" />
            </g>
          );
        })}
        <rect className="l-counter" x="60" y="118" width="160" height="26" fill={WOOD} {...s} />
        <g className="l-tag">
          <path d="M226 118v6" stroke={INK} strokeWidth="1" />
          <rect x="218" y="124" width="16" height="10" fill={PAPER} {...s} strokeWidth="1" />
          <circle cx="226" cy="129" r="1.4" fill={ACCENT} />
        </g>
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".l-item"), { scale: 0, transformOrigin: "50% 100%", stagger: 0.04, duration: 0.18, ease: "back.out(2)" }, 0)
        .from(q(".l-counter"), { y: 20, opacity: 0, duration: 0.25 }, 0.5)
        .from(q(".l-tag"), { opacity: 0, duration: 0.1 }, 0.62)
        .fromTo(q(".l-tag"), { rotation: -35, transformOrigin: "50% 0%" }, { rotation: 0, duration: 0.3, ease: "elastic.out(1, 0.35)" }, 0.7);
    },
  },

  praxis: {
    label: "Apothekerauszug",
    draw: () => (
      <>
        <path d="M20 142H262" stroke={INK} strokeWidth="2" />
        <g className="p-pull">
          <rect x="44" y="14" width="54" height="126" fill={PAPER} {...s} />
          {[44, 76, 108].map((y) => (
            <path key={y} d={`M44 ${y}H98`} stroke={INK} strokeWidth="1.2" />
          ))}
          {[30, 62, 94, 126].map((base, r) =>
            [0, 1, 2].map((k) => (
              <rect
                key={`${r}-${k}`}
                x={50 + k * 16}
                y={base - (k === 1 ? 13 : 10)}
                width="11"
                height={k === 1 ? 13 : 10}
                rx="2"
                fill={[ACCENT, MUTED, WOOD_DARK][(r + k) % 3]}
              />
            )),
          )}
          <rect x="98" y="14" width="6" height="126" fill={WOOD_DARK} {...s} />
        </g>
        <rect x="40" y="10" width="70" height="132" fill={WOOD} {...s} />
        <rect className="p-handle" x="102" y="60" width="3" height="30" fill={INK} />
        <path className="p-rail" d="M110 140H246" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="4 3" />
      </>
    ),
    build: (tl, q) => {
      tl.fromTo(q(".p-rail"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35 }, 0)
        .to(q(".p-pull"), { x: 148, duration: 0.6, ease: "power2.inOut" }, 0.25)
        .to(q(".p-handle"), { x: 148, duration: 0.6, ease: "power2.inOut" }, 0.25);
    },
  },

  buero: {
    label: "Konferenztisch",
    draw: () => (
      <>
        <rect x="55" y="45" width="170" height="60" rx="30" fill={WOOD} stroke={INK} strokeWidth="2" />
        <path className="b-cable" d="M85 75H195" stroke={ACCENT} strokeWidth="2" strokeDasharray="5 4" />
        {[100, 140, 180].map((x) => (
          <rect key={x} className="b-port" x={x - 4} y="71" width="8" height="8" rx="1.5" fill={INK} />
        ))}
        {[
          [85, 22, 0, -1],
          [140, 22, 0, -1],
          [195, 22, 0, -1],
          [85, 112, 0, 1],
          [140, 112, 0, 1],
          [195, 112, 0, 1],
          [28, 62, -1, 0],
          [236, 62, 1, 0],
        ].map(([x, y, dx, dy], i) => (
          <rect
            key={i}
            className="b-chair"
            data-dx={dx}
            data-dy={dy}
            x={x - (dx ? 8 : 13)}
            y={y}
            width={dx ? 16 : 26}
            height={dx ? 26 : 16}
            rx="5"
            fill={i % 2 ? INK : WALNUT}
          />
        ))}
      </>
    ),
    build: (tl, q) => {
      tl.from(q(".b-chair"), {
        x: (_i: number, el: Element) => Number((el as HTMLElement).dataset.dx) * 22,
        y: (_i: number, el: Element) => Number((el as HTMLElement).dataset.dy) * 22,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power3.out",
      }, 0)
        .fromTo(q(".b-cable"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.3 }, 0.45)
        .from(q(".b-port"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.06, duration: 0.12, ease: "back.out(3)" }, 0.7);
    },
  },

  "hotel-gastro-freizeit": {
    label: "Lamellenwand",
    draw: () => (
      <>
        <rect className="h-glow" x="24" y="14" width="232" height="104" fill={ACCENT} opacity="0.55" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} className="h-slat" x={26 + i * 14.4} y="10" width="12" height="112" fill={WOOD} {...s} strokeWidth="1" />
        ))}
        <path className="h-bench" d="M24 140 C 90 124, 190 124, 256 140" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
    build: (tl, q) => {
      tl.to(q(".h-slat"), { scaleX: 0.3, transformOrigin: "50% 50%", stagger: 0.035, duration: 0.3, ease: "power2.inOut" }, 0)
        .from(q(".h-glow"), { opacity: 0, duration: 0.4 }, 0.25)
        .fromTo(q(".h-bench"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.3 }, 0.6);
    },
  },
};

/**
 * Kleines Detailblatt je Leistungsbereich (dekorativ): eine Werkzeichnung, die sich beim Scrollen aufbaut
 * (scrub) – Hochklappen öffnen, Bücher rutschen ins Regal, Dielen werden verlegt … Eigenes Detail für jeden
 * Bereich, damit sich die acht gleich gebauten Sektionen unterscheiden. Ohne JS / reduziert: Endzustand.
 */
export function ToolDetail({ id, className = "" }: { id: string; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  const kind = KINDS[id];

  useMotion(
    ({ reduce, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce || !kind) return;
      defer(() => {
        const svg = el.querySelector("svg")!;
        const q: Q = (sel) => svg.querySelectorAll<SVGElement>(sel);
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: el, start: "top 88%", end: "center 42%", scrub: 0.6 },
        });
        kind.build(tl, q);
        tl.set({}, {}, 1);
      });
    },
    { scope: root },
  );

  if (!kind) return null;
  return (
    <figure ref={root} aria-hidden className={`tool-card ${className}`}>
      <figcaption className="tool-head mono">
        <span>Detail · {kind.label}</span>
        <span>M 1:20</span>
      </figcaption>
      <svg viewBox="0 0 280 150" className="tool-svg" focusable="false">
        {kind.draw(uid)}
      </svg>
    </figure>
  );
}
