import { ButtonLink } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { img } from "@/content/images";
import { home } from "@/content/pages";
import { site } from "@/content/site";

const door = img("privat/wohnen/spiegel-schrankwand-schlafzimmer");

/** Schwestermarke Cabinet – Bild öffnet sich wie eine Schiebetür (clip „door“). */
export function CabinetTeaser({ number = "08" }: { number?: string }) {
  const c = home.cabinet;
  return (
    <section aria-labelledby="cabinet-title" className="section-y">
      <div className="container-site grid-12 items-end gap-y-12">
        <div className="relative col-span-4 md:col-span-5 lg:col-span-6">
          <div className="pt-8">
            <div className="absolute inset-x-0 top-0">
              <Dimension label="Schiebetür · 2 × 1 200" />
            </div>
            <Figure image={door} sizes="(min-width: 1024px) 600px, 100vw" reveal="door" />
          </div>
        </div>
        <div className="col-span-4 md:col-span-3 lg:col-span-5 lg:col-start-8">
          <Eyebrow number={number} className="text-ink-muted">
            Schwestermarke
          </Eyebrow>
          <h2 id="cabinet-title" data-split className="mt-6 text-h2">
            {c.title}
          </h2>
          <p className="mt-6 max-w-[48ch] text-ink-muted">{c.text}</p>
          <div className="mt-10">
            <ButtonLink href={site.cabinet.url} variant="secondary" external>
              {c.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
