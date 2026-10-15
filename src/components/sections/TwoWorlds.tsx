import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/ButtonLink";
import { img } from "@/content/images";
import { home } from "@/content/pages";

/**
 * „Zwei Welten“: geteilte Fläche; die gehoverte/fokussierte Hälfte wächst (flex-grow per CSS-Transition),
 * das Bild gibt mehr frei (clip-path). Mobil gestapelt. Reduzierte Bewegung → keine Übergänge.
 */
export function TwoWorlds() {
  return (
    <section aria-labelledby="worlds-title" className="pb-[var(--spacing-section)]">
      <div className="container-site">
        <h2 id="worlds-title" className="sr-only">
          Zwei Welten: Privat und Gewerbe
        </h2>
        <div className="worlds flex flex-col gap-4 lg:h-[min(82vh,760px)] lg:flex-row">
          {home.worlds.map((w, i) => {
            const image = img(w.image);
            return (
              <article key={w.key} className="world group relative flex min-h-[520px] flex-col overflow-hidden bg-paper-2 lg:min-h-0">
                <div className="world-media relative flex-1 overflow-hidden">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    quality={85}
                    className="object-cover"
                  />
                  <div aria-hidden className="grain absolute inset-0" />
                </div>
                <div className="relative z-10 flex flex-col gap-4 p-[clamp(1.25rem,3vw,2.5rem)]">
                  <p className="eyebrow flex justify-between text-ink-muted">
                    <span>
                      Pos. {i === 0 ? "A" : "B"} — {w.eyebrow}
                    </span>
                    <span aria-hidden className="hidden sm:inline">
                      {w.key === "privat" ? "Wohnräume" : "Objekte"} / 0{i + 1}
                    </span>
                  </p>
                  <h3 className="text-h2">
                    <Link href={w.href} className="world-link outline-none after:absolute after:inset-0 after:z-20">
                      {w.title}
                    </Link>
                  </h3>
                  <p className="max-w-[46ch] text-ink-muted">{w.text}</p>
                  <p className="inline-flex items-center gap-3 font-medium" aria-hidden>
                    <span className="world-cta">{w.cta}</span>
                    <Arrow />
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
