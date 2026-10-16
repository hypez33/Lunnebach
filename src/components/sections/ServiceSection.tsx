import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";
import { Figure } from "@/components/ui/Figure";
import { ToolDetail } from "@/components/ui/ToolDetail";
import { img } from "@/content/images";
import { projects } from "@/content/projects";
import type { Service } from "@/content/types";

/** Zuordnung Leistungsbereich → passendes Referenzprojekt */
const RELATED: Record<string, string> = {
  kuechen: "kueche-nussbaum",
  wohnen: "wohnen-bibliothek",
  einbau: "schrankwand-dachschraege",
  bad: "bad-waschtisch",
  outdoor: "garten-terrasse",
  ladenbau: "friseursalon-koblenz",
  buero: "buero-konferenz",
  "hotel-gastro-freizeit": "emser-therme",
};

export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const [main, ...rest] = service.images.map(img);
  const secondary = rest.slice(0, 3);
  const flip = index % 2 === 1;
  const related = projects.find((p) => p.slug === RELATED[service.id]);

  return (
    <section id={service.id} aria-labelledby={`${service.id}-title`} className="section-y scroll-mt-[var(--header-h)] border-t border-line">
      <div className="container-site grid-12 gap-y-12">
        <div className={`col-span-4 md:col-span-8 lg:col-span-4 ${flip ? "lg:order-2 lg:col-start-9" : ""}`}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow text-ink-muted">{service.short}</p>
            <h2 id={`${service.id}-title`} data-split className="mt-6 text-h2">
              {service.title}
            </h2>
            <p className="mt-6 max-w-[44ch] text-lead text-ink-muted">{service.text}</p>
            {service.bullets && (
              <ul className="mt-8 border-t border-line">
                {service.bullets.map((b) => (
                  <li key={b} className="flex gap-4 border-b border-line py-3">
                    <span aria-hidden className="mono pt-0.5 text-xs text-accent-text">
                      +
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-col items-start gap-4">
              <ButtonLink href="/anfrage">Projekt anfragen</ButtonLink>
              {related && (
                <Link href={`/projekte/${related.slug}`} className="group inline-flex min-h-11 items-center gap-2 font-medium">
                  <span className="link-line">Referenz: {related.title}</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={`col-span-4 md:col-span-8 lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
          {main && (
            <div className="relative pt-8" style={{ maxWidth: main.width }}>
              <div className="absolute inset-x-0 top-0">
                <Dimension label={service.dimension ?? ""} />
              </div>
              <Figure image={main} sizes="(min-width: 1024px) 800px, 100vw" reveal={flip ? "door" : "left"} />
            </div>
          )}
          {/* Eigenes Werkzeug-Detail je Bereich – baut sich beim Scrollen auf */}
          <ToolDetail id={service.id} className={`relative z-10 mt-6 lg:-mt-24 ${flip ? "lg:mr-auto lg:-ml-6" : "lg:ml-auto lg:-mr-6"}`} />
          {secondary.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 items-start gap-4 md:grid-cols-3">
              {secondary.map((im, i) => (
                <li key={im.id} className={i === 1 ? "md:mt-12" : i === 2 ? "hidden md:block md:mt-4" : ""}>
                  <Figure image={im} sizes="(min-width: 1024px) 280px, 50vw" reveal="up" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
