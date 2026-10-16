import Image from "next/image";
import { HeroBlueprint } from "@/components/motion/HeroBlueprint";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";
import { img } from "@/content/images";
import { home } from "@/content/pages";

const panel = img("hero/moebelbau-vitrine"); // 450 × 700 – wird nie breiter als nativ dargestellt
const detail = img("privat/wohnen/wohnzimmer-vitrine-detail");

export function Hero() {
  const h = home.hero;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-55" />
      <HeroMotion className="container-site relative pb-[clamp(4rem,8vw,8rem)] pt-[clamp(2rem,4vw,3.5rem)]">
        <div className="flex items-center justify-between gap-6">
          <p className="eyebrow text-ink-muted">{h.eyebrow}</p>
          <p className="eyebrow hidden text-ink-muted md:block" aria-hidden>
            Blatt 01 · M 1:20
          </p>
        </div>

        {/* Anrisslinie (Streichmaß) */}
        <svg
          data-hero-line
          aria-hidden
          focusable="false"
          className="mt-5 block h-[2px] w-full overflow-visible text-accent"
          viewBox="0 0 1000 2"
          preserveAspectRatio="none"
        >
          <path d="M0 1H1000" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>

        <div className="grid-12 mt-[clamp(2rem,4vw,3.5rem)] gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:pt-2">
            <h1 id="hero-title" data-hero-title data-hero-hidden className="text-display font-[440] tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_60]">
              {/* Mobil sofort sichtbar (LCP-Element), Desktop zeilenweise per SplitText */}
              {h.titleLines[0]} <br className="hidden lg:block" />
              {h.titleLines[1]}
            </h1>
            <p data-hero-fade data-hero-hidden className="mt-8 max-w-[52ch] text-lead text-ink-muted">
              {h.subline}
            </p>
            <div data-hero-fade data-hero-hidden className="mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 1 }}>
              <ButtonLink href={h.ctaPrimary.href}>{h.ctaPrimary.label}</ButtonLink>
              <ButtonLink href={h.ctaSecondary.href} variant="secondary">
                {h.ctaSecondary.label}
              </ButtonLink>
            </div>
          </div>

          <div className="relative col-span-4 md:col-span-6 md:col-start-2 lg:col-span-4 lg:col-start-9">
            <div className="relative ml-auto w-[min(100%,450px)] pl-10">
              <div data-hero-parallax className="relative">
                {/* Vertikale Maßkette: Höhe der Vitrine (illustrativ) */}
                <div data-hero-dim data-hero-hidden data-orientation="vertical" className="absolute -left-10 bottom-0 top-0 w-[14px]">
                  <Dimension label="H 2 180" orientation="vertical" animate={false} side="end" />
                </div>
                <div
                  data-hero-door
                  className="grain relative overflow-hidden bg-paper-2"
                  style={{ aspectRatio: `${panel.width} / ${panel.height}` }}
                >
                  <HeroImage />
                  {/* Röntgenblick: Werkzeichnung unter dem Foto (Lupe mit Maus, Scanlinie auf Touch) */}
                  <HeroBlueprint />
                </div>
              </div>
              <p className="mono mt-3 max-w-[58%] text-[0.75rem] leading-relaxed text-ink-muted">
                Pos. 01 — Vitrine, Wandnische
                <br />
                <span aria-hidden>Nussbaum · Glas · LED</span>
                <span aria-hidden className="bp-hint">Mit der Maus über das Bild: Werkzeichnung</span>
              </p>
              {/* Detail-Ausschnitt als zweite Ebene, nur ab Tablet */}
              <div data-hero-fade data-hero-hidden style={{ ["--i" as string]: 2 }} className="grain absolute -bottom-16 -right-4 hidden w-[38%] overflow-hidden border-[6px] border-paper bg-paper-2 md:block xl:-right-10">
                <DetailImage />
              </div>
            </div>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}

function HeroImage() {
  return (
    <Image
      src={panel.src}
      alt={panel.alt}
      fill
      preload
      sizes="(min-width: 1024px) 420px, (min-width: 768px) 60vw, 90vw"
      placeholder="blur"
      blurDataURL={panel.blurDataURL}
      quality={85}
      className="object-cover"
    />
  );
}

function DetailImage() {
  return (
    <Image
      src={detail.src}
      alt=""
      width={detail.width}
      height={detail.height}
      sizes="200px"
      placeholder="blur"
      blurDataURL={detail.blurDataURL}
      className="block aspect-[4/5] w-full object-cover"
    />
  );
}
