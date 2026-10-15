"use client";

import { useState } from "react";
import { site } from "@/content/site";

/**
 * Karte erst nach Klick (OpenStreetMap). Vorher: gezeichneter „Lageplan“ als Platzhalter,
 * keine Verbindung zu Dritten.
 */
export function MapEmbed() {
  const [active, setActive] = useState(false);
  const { lat, lng } = site.address.geo;
  const d = 0.006;
  const bbox = [lng - d * 1.6, lat - d, lng + d * 1.6, lat + d].map((n) => n.toFixed(5)).join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const route = `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-line-strong bg-paper-2 sm:aspect-[4/3] md:aspect-[16/11]">
        {active ? (
          <iframe
            src={src}
            title={`Karte: ${site.address.street}, ${site.address.zip} ${site.address.city}`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        ) : (
          <>
            <svg aria-hidden className="absolute inset-0 h-full w-full text-ink" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.08" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#mapgrid)" />
              {/* stilisierte Straßen */}
              <g fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="9" strokeLinecap="round">
                <path d="M-10 210 C 90 190, 160 160, 410 150" />
                <path d="M120 -10 C 140 80, 170 170, 190 310" />
              </g>
              <g fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="4">
                <path d="M-10 90 C 120 100, 260 70, 410 60" />
                <path d="M300 -10 L 260 310" />
                <path d="M30 310 C 60 240, 40 160, 70 -10" />
              </g>
              {/* Fluss (Mosel) als Fläche */}
              <path d="M-10 270 C 120 250, 260 300, 410 260 L410 310 L-10 310 Z" fill="currentColor" fillOpacity="0.07" />
              {/* Fadenkreuz */}
              <g stroke="var(--color-accent)" strokeWidth="1.25">
                <circle cx="210" cy="140" r="16" fill="none" />
                <path d="M210 108V172M178 140H242" />
              </g>
              <circle cx="210" cy="140" r="4" fill="var(--color-accent)" />
            </svg>
            <div className="absolute left-4 top-4 bg-paper/90 px-3 py-2">
              <p className="mono text-[0.75rem] uppercase tracking-[0.1em]">Lageplan · nicht maßstäblich</p>
            </div>
            <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="bg-paper/90 px-3 py-2 text-sm">
                {site.address.street}, {site.address.zip} {site.address.city}
              </p>
              <button type="button" onClick={() => setActive(true)} className="btn btn-primary">
                <span className="btn-label">Karte laden</span>
              </button>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        Die Karte wird von OpenStreetMap geladen; dabei wird Ihre IP-Adresse übertragen.{" "}
        <a href={route} className="text-link" target="_blank" rel="noopener">
          Route planen<span className="sr-only"> (OpenStreetMap, öffnet in neuem Tab)</span>
        </a>
      </p>
    </div>
  );
}
