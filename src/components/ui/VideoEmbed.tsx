"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ImageAsset } from "@/content/images";

/**
 * YouTube erst nach Klick (youtube-nocookie.com). Vorher keine Verbindung zu YouTube,
 * das Vorschaubild ist lokal. Kein Autoplay mit Ton ohne Nutzeraktion.
 */
export function VideoEmbed({ id, title, poster }: { id: string; title: string; poster: ImageAsset }) {
  const [active, setActive] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden bg-ink-2">
        {active ? (
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            onLoad={() => frameRef.current?.focus()}
          />
        ) : (
          <>
            <Image
              src={poster.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              placeholder="blur"
              blurDataURL={poster.blurDataURL}
              className="object-cover opacity-70 grayscale-[35%]"
            />
            <div aria-hidden className="grain absolute inset-0" />
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 flex items-center justify-center"
            >
              <span className="flex items-center gap-4 rounded-[2px] bg-accent px-5 py-3 font-medium text-ink">
                <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
                  <path d="M0 0v16l14-8z" fill="currentColor" />
                </svg>
                <span className="btn-label">Video abspielen</span>
                <span className="sr-only">: {title}</span>
              </span>
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-sm text-paper-muted">
        Beim Abspielen wird eine Verbindung zu YouTube (Google) hergestellt. Mehr dazu in der{" "}
        <a href="/datenschutz" className="text-link">
          Datenschutzerklärung
        </a>
        .
      </p>
    </div>
  );
}
