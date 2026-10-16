"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import type { ImageAsset } from "@/content/images";
import { gsap } from "@/lib/motion/gsap";
import { isMotionReduced } from "@/lib/motion/preference";

export type GalleryItem = { image: ImageAsset; caption?: string };

/** Editorial-Raster: Spaltenbreiten/Versätze wiederholen sich, Bilder nie breiter als nativ */
const LAYOUT = [
  "lg:col-span-7",
  "lg:col-span-4 lg:col-start-9 lg:mt-32",
  "lg:col-span-5 lg:col-start-2",
  "lg:col-span-6 lg:col-start-7 lg:mt-20",
  "lg:col-span-4",
  "lg:col-span-4 lg:mt-24",
  "lg:col-span-4 lg:mt-8",
];

const EASE_IN_OUT = "power3.inOut";
/** React Aria wartet bei onEnter/onExit auf ein Promise<void> */
const finished = (anim: gsap.core.Animation) => new Promise<void>((resolve) => void anim.then(() => resolve()));

/** Widerstand am Anfang/Ende: Das Bild folgt dem Finger nur noch gedämpft */
const rubber = (d: number, limit = 140) => (limit * d) / (limit + Math.abs(d));

/**
 * Galerie mit barrierefreier Lightbox (React-Aria-Dialog):
 * Fokus wird gefangen und zurückgegeben, Escape schließt, Pfeiltasten blättern,
 * Bildunterschrift und Zähler werden per aria-live angesagt.
 * Motion: Das Bild wächst beim Öffnen aus der angetippten Kachel und kehrt beim Schließen dorthin zurück
 * (über onEnter/onExit von React Aria – Fokus und Escape bleiben dort). Wischen links/rechts blättert
 * (Rubber-Band an Bild 1 und N), Wischen nach unten schließt. Die Buttons bleiben die zugängliche Alternative.
 * Reduzierte Bewegung: nur ein-/ausblenden, Bildwechsel ohne Gleiten.
 */
export function Gallery({ items, title }: { items: GalleryItem[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  // Bleibt beim Schließen stehen, damit das Bild während der Exit-Animation sichtbar ist
  const [shown, setShown] = useState(0);
  const open = index !== null;
  const current = items[shown];
  const total = items.length;

  const tiles = useRef<(HTMLElement | null)[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const slideDir = useRef<1 | -1 | 0>(0);

  const show = (i: number, dir: 1 | -1 | 0) => {
    slideDir.current = dir;
    setShown(i);
    setIndex(i);
  };
  const go = (dir: 1 | -1) => show((shown + dir + total) % total, dir);

  // Pfeiltasten blättern, solange die Lightbox offen ist
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      show((shown + dir + total) % total, dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shown, total]);

  // Neues Bild gleitet aus der Blätterrichtung herein
  useLayoutEffect(() => {
    const dir = slideDir.current;
    slideDir.current = 0;
    const el = frame.current;
    if (!dir || !el) return;
    if (isMotionReduced()) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, x: 0, duration: 0.2, overwrite: true });
      return;
    }
    gsap.fromTo(el, { x: dir * Math.min(window.innerWidth * 0.4, 260), opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power3.out", overwrite: true });
  }, [shown]);

  /** Lage der Kachel relativ zum Lightbox-Rahmen (für Flip) – null, wenn die Kachel nicht im Bild ist */
  const tileDelta = (i: number) => {
    const tile = tiles.current[i];
    const f = frame.current;
    if (!tile || !f) return null;
    const t = tile.getBoundingClientRect();
    if (t.bottom < 0 || t.top > window.innerHeight) return null;
    gsap.set(f, { clearProps: "transform" });
    const r = f.getBoundingClientRect();
    return {
      x: t.left + t.width / 2 - (r.left + r.width / 2),
      y: t.top + t.height / 2 - (r.top + r.height / 2),
      scale: t.width / r.width,
    };
  };

  const onEnter = () => {
    const chrome = backdrop.current?.parentElement?.querySelectorAll("[data-lb-chrome]") ?? [];
    if (isMotionReduced()) {
      return finished(gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }));
    }
    const tl = gsap.timeline();
    tl.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
    const d = tileDelta(shown);
    if (d && frame.current) tl.from(frame.current, { ...d, duration: 0.6, ease: EASE_IN_OUT }, 0);
    else if (frame.current) tl.from(frame.current, { scale: 0.92, opacity: 0, duration: 0.4, ease: "power3.out" }, 0);
    tl.from(chrome, { opacity: 0, y: 8, duration: 0.35, stagger: 0.05, ease: "power2.out" }, 0.25);
    return finished(tl);
  };

  const onExit = () => {
    const chrome = backdrop.current?.parentElement?.querySelectorAll("[data-lb-chrome]") ?? [];
    if (isMotionReduced()) {
      return finished(gsap.to([backdrop.current, frame.current, ...chrome], { opacity: 0, duration: 0.15 }));
    }
    const f = frame.current;
    const tl = gsap.timeline();
    tl.to(chrome, { opacity: 0, duration: 0.15 }, 0);
    // vom aktuellen Zustand (ggf. mitten in der Wischgeste) zurück zur Kachel
    const from = f ? { x: gsap.getProperty(f, "x"), y: gsap.getProperty(f, "y"), scale: gsap.getProperty(f, "scale") } : null;
    const d = tileDelta(shown);
    if (f && from) gsap.set(f, from);
    if (f && d) tl.to(f, { ...d, duration: 0.45, ease: EASE_IN_OUT }, 0);
    else if (f) tl.to(f, { opacity: 0, scale: 0.94, duration: 0.25 }, 0);
    tl.to(backdrop.current, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.05);
    return finished(tl);
  };

  // ---- Wischgesten (Pointer Events) --------------------------------------------------------
  const drag = useRef<{ id: number; x: number; y: number; t: number; axis: "x" | "y" | null; dx: number; dy: number } | null>(null);
  const closeRef = useRef<() => void>(() => {});

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !frame.current) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), axis: null, dx: 0, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    gsap.killTweensOf(frame.current);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const f = frame.current;
    if (!d || d.id !== e.pointerId || !f) return;
    d.dx = e.clientX - d.x;
    d.dy = e.clientY - d.y;
    if (!d.axis && Math.hypot(d.dx, d.dy) > 8) d.axis = Math.abs(d.dx) > Math.abs(d.dy) ? "x" : "y";
    if (d.axis === "x") {
      const atEdge = (shown === 0 && d.dx > 0) || (shown === total - 1 && d.dx < 0);
      gsap.set(f, { x: atEdge ? rubber(d.dx) : d.dx, y: 0, scale: 1 });
    } else if (d.axis === "y") {
      const dy = d.dy > 0 ? d.dy : rubber(d.dy, 60);
      gsap.set(f, { y: dy, x: d.dx * 0.25, scale: 1 - Math.min(Math.max(dy, 0) / 1400, 0.18) });
      gsap.set(backdrop.current, { opacity: 1 - Math.min(Math.max(dy, 0) / 520, 0.6) });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    const f = frame.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !f) return;
    const dt = Math.max(1, performance.now() - d.t);
    const settle = () => {
      gsap.to(f, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
      gsap.to(backdrop.current, { opacity: 1, duration: 0.3 });
    };
    if (d.axis === "x") {
      const dir: 1 | -1 = d.dx < 0 ? 1 : -1;
      const atEdge = (dir === -1 && shown === 0) || (dir === 1 && shown === total - 1);
      const passed = Math.abs(d.dx) > Math.min(110, window.innerWidth * 0.2) || Math.abs(d.dx / dt) > 0.55;
      if (passed && !atEdge) {
        const reduce = isMotionReduced();
        gsap.to(f, {
          x: -dir * window.innerWidth * 0.6,
          opacity: 0,
          duration: reduce ? 0 : 0.2,
          ease: "power2.in",
          onComplete: () => show(shown + dir, dir),
        });
      } else settle();
    } else if (d.axis === "y") {
      if (d.dy > 120 || d.dy / dt > 0.6) closeRef.current();
      else settle();
    }
  };

  return (
    <>
      <ul data-clip-batch className="grid-12 gap-y-[clamp(2rem,5vw,5rem)]">
        {items.map((item, i) => (
          <li key={item.image.id + i} className={`col-span-4 md:col-span-4 ${LAYOUT[i % LAYOUT.length]}`}>
            <figure style={{ maxWidth: item.image.width }}>
              <Button
                ref={(el) => {
                  tiles.current[i] = el;
                }}
                onPress={() => show(i, 0)}
                className="press group relative block w-full cursor-zoom-in overflow-hidden bg-paper-2 outline-none transition-[scale,opacity] duration-150 [--press-scale:0.985] data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-4 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
                aria-label={`Bild ${i + 1} von ${total} vergrößern${item.caption ? `: ${item.caption}` : ""}`}
              >
                <span data-clip="up" className="grain relative block" style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}>
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={item.image.blurDataURL}
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo-out)] group-hover:scale-[1.03]"
                  />
                </span>
                {/* Auf Touch-Geräten dauerhaft sichtbar (kein Hover) */}
                <span aria-hidden className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-paper/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-data-[focus-visible]:opacity-100 [@media(hover:none)]:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 5V1h4M13 5V1H9M1 9v4h4M13 9v4H9" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </Button>
              <figcaption className="mono mt-3 flex gap-3 text-[0.8125rem] text-ink-muted">
                <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <span>{item.caption ?? item.image.alt}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <ModalOverlay
        isOpen={open}
        onOpenChange={(o) => !o && setIndex(null)}
        onEnter={onEnter}
        onExit={onExit}
        isDismissable
        className="fixed inset-0 z-[70]"
      >
        <div ref={backdrop} aria-hidden className="absolute inset-0 bg-ink/95" />
        <Modal className="fixed inset-0">
          <Dialog
            aria-labelledby="lightbox-title"
            data-theme="dark"
            className="theme-dark flex h-full flex-col !bg-transparent outline-none"
          >
            {({ close }) => {
              closeRef.current = close;
              return (
                <>
                  <div data-lb-chrome className="container-site flex min-h-[var(--header-h)] items-center justify-between gap-4">
                    <Heading slot="title" id="lightbox-title" className="eyebrow !font-mono !tracking-[0.12em] text-paper-muted">
                      {title} · Galerie
                    </Heading>
                    <Button
                      onPress={close}
                      className="press inline-flex h-11 items-center gap-2 rounded-[2px] border-[1.5px] border-paper px-3 font-medium text-paper transition-[scale,opacity] duration-150"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                      Schließen
                    </Button>
                  </div>

                  <div className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--spacing-gutter)]">
                    {current && (
                      <figure className="flex max-h-full w-full flex-col items-center">
                        <div
                          className="flex w-full cursor-grab touch-pinch-zoom select-none justify-center active:cursor-grabbing"
                          onPointerDown={onPointerDown}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          onPointerCancel={onPointerUp}
                        >
                          <div
                            ref={frame}
                            className="relative w-full"
                            style={{ maxWidth: current.image.width, aspectRatio: `${current.image.width} / ${current.image.height}`, maxHeight: "72dvh" }}
                          >
                            <Image
                              key={current.image.id}
                              src={current.image.src}
                              alt={current.image.alt}
                              fill
                              draggable={false}
                              sizes="800px"
                              placeholder="blur"
                              blurDataURL={current.image.blurDataURL}
                              className="pointer-events-none object-contain"
                            />
                          </div>
                        </div>
                        <figcaption data-lb-chrome aria-live="polite" className="mt-4 flex w-full max-w-[800px] justify-between gap-6 text-sm text-paper-muted">
                          <span>{current.caption ?? current.image.alt}</span>
                          <span className="mono shrink-0">
                            {String(shown + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                          </span>
                        </figcaption>
                      </figure>
                    )}
                  </div>

                  <div data-lb-chrome className="container-site flex items-center justify-between gap-4 py-6">
                    <Button
                      onPress={() => go(-1)}
                      className="press inline-flex h-12 items-center gap-3 rounded-[2px] border-[1.5px] border-paper px-4 font-medium text-paper transition-[scale,opacity] duration-150"
                    >
                      <span aria-hidden>←</span> Vorheriges<span className="max-sm:sr-only"> Bild</span>
                    </Button>
                    <p className="mono hidden text-xs text-paper-muted md:block" aria-hidden>
                      ← → blättern · Esc schließt
                    </p>
                    <Button
                      onPress={() => go(1)}
                      className="press inline-flex h-12 items-center gap-3 rounded-[2px] border-[1.5px] border-paper px-4 font-medium text-paper transition-[scale,opacity] duration-150"
                    >
                      Nächstes<span className="max-sm:sr-only"> Bild</span> <span aria-hidden>→</span>
                    </Button>
                  </div>
                </>
              );
            }}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
