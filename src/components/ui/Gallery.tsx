"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import type { ImageAsset } from "@/content/images";

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

/**
 * Galerie mit barrierefreier Lightbox (React-Aria-Dialog):
 * Fokus wird gefangen und zurückgegeben, Escape schließt, Pfeiltasten blättern,
 * Bildunterschrift und Zähler werden per aria-live angesagt.
 */
export function Gallery({ items, title }: { items: GalleryItem[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = index !== null ? items[index] : null;
  const total = items.length;

  const go = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + total) % total));

  // Pfeiltasten blättern, solange die Lightbox offen ist
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      setIndex((i) => (i === null ? i : (i + (e.key === "ArrowRight" ? 1 : -1) + total) % total));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  return (
    <>
      <ul className="grid-12 gap-y-[clamp(2rem,5vw,5rem)]">
        {items.map((item, i) => (
          <li key={item.image.id + i} className={`col-span-4 md:col-span-4 ${LAYOUT[i % LAYOUT.length]}`}>
            <figure style={{ maxWidth: item.image.width }}>
              <Button
                onPress={() => setIndex(i)}
                className="group relative block w-full cursor-zoom-in overflow-hidden bg-paper-2 outline-none data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-4 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
                aria-label={`Bild ${i + 1} von ${total} vergrößern${item.caption ? `: ${item.caption}` : ""}`}
              >
                <div data-clip="up" className="grain relative" style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}>
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={item.image.blurDataURL}
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo-out)] group-hover:scale-[1.03]"
                  />
                </div>
                <span aria-hidden className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-paper/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-data-[focus-visible]:opacity-100">
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
        isDismissable
        className="fixed inset-0 z-[70] bg-ink/95"
      >
        <Modal className="fixed inset-0">
          <Dialog
            aria-labelledby="lightbox-title"
            data-theme="dark"
            className="theme-dark flex h-full flex-col bg-transparent outline-none"
          >
            {({ close }) => (
              <>
                <div className="container-site flex min-h-[var(--header-h)] items-center justify-between gap-4">
                  <Heading slot="title" id="lightbox-title" className="eyebrow !font-mono !tracking-[0.12em] text-paper-muted">
                    {title} · Galerie
                  </Heading>
                  <Button
                    onPress={close}
                    className="inline-flex h-11 items-center gap-2 rounded-[2px] border-[1.5px] border-paper px-3 font-medium text-paper"
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
                        className="relative w-full"
                        style={{ maxWidth: current.image.width, aspectRatio: `${current.image.width} / ${current.image.height}`, maxHeight: "72vh" }}
                      >
                        <Image
                          key={current.image.id}
                          src={current.image.src}
                          alt={current.image.alt}
                          fill
                          sizes="800px"
                          placeholder="blur"
                          blurDataURL={current.image.blurDataURL}
                          className="object-contain"
                        />
                      </div>
                      <figcaption aria-live="polite" className="mt-4 flex w-full max-w-[800px] justify-between gap-6 text-sm text-paper-muted">
                        <span>{current.caption ?? current.image.alt}</span>
                        <span className="mono shrink-0">
                          {String((index ?? 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </span>
                      </figcaption>
                    </figure>
                  )}
                </div>

                <div className="container-site flex items-center justify-between gap-4 py-6">
                  <Button
                    onPress={() => go(-1)}
                    className="inline-flex h-12 items-center gap-3 rounded-[2px] border-[1.5px] border-paper px-4 font-medium text-paper"
                  >
                    <span aria-hidden>←</span> Vorheriges Bild
                  </Button>
                  <p className="mono hidden text-xs text-paper-muted md:block" aria-hidden>
                    ← → blättern · Esc schließt
                  </p>
                  <Button
                    onPress={() => go(1)}
                    className="inline-flex h-12 items-center gap-3 rounded-[2px] border-[1.5px] border-paper px-4 font-medium text-paper"
                  >
                    Nächstes Bild <span aria-hidden>→</span>
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
