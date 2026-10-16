import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { home } from "@/content/pages";
import { featuredProjects } from "@/content/projects";

/**
 * Editorial-Raster in zwei versetzten Spalten (7 + 5), die etwa gleich hoch sind – keine Löcher zwischen
 * den Karten. Bilder nie breiter als nativ (alle ~800 px): links max. ~740 px, rechts ~540 px.
 */
export function FeaturedProjects() {
  const [a, b, c, d] = featuredProjects;
  return (
    <section aria-labelledby="featured-title" className="section-y border-t border-line">
      <div className="container-site">
        <div className="grid-12 items-end gap-y-6">
          <Eyebrow className="col-span-4 self-start text-ink-muted md:col-span-8 lg:col-span-3">Projekte</Eyebrow>
          <h2 id="featured-title" data-split className="col-span-4 text-h2 md:col-span-5 lg:col-span-5">
            {home.featured.title}
          </h2>
          <div className="col-span-4 flex flex-col items-start gap-6 md:col-span-3 lg:col-span-4">
            <p className="text-lead text-ink-muted">{home.featured.intro}</p>
            <ButtonLink href="/projekte" variant="secondary" className="hidden md:inline-flex">
              Alle Projekte
            </ButtonLink>
          </div>
        </div>

        <div className="mt-[clamp(3rem,6vw,5.5rem)] grid gap-y-[clamp(3.5rem,6vw,5rem)] md:grid-cols-12 md:gap-x-[clamp(1.5rem,3vw,3rem)]">
          <div className="flex flex-col gap-y-[clamp(3.5rem,6vw,5rem)] md:col-span-7">
            {a && <ProjectCard project={a} scrollDimension aspect="4 / 3" sizes="(min-width: 1024px) 760px, (min-width: 768px) 58vw, 100vw" />}
            {c && <ProjectCard project={c} scrollDimension aspect="3 / 2" sizes="(min-width: 1024px) 760px, (min-width: 768px) 58vw, 100vw" />}
          </div>
          <div className="flex flex-col gap-y-[clamp(3.5rem,6vw,5rem)] md:col-span-5 md:pt-[clamp(3rem,7vw,6rem)]">
            {b && <ProjectCard project={b} scrollDimension aspect="1 / 1" sizes="(min-width: 1024px) 560px, (min-width: 768px) 42vw, 100vw" />}
            {d && <ProjectCard project={d} scrollDimension aspect="4 / 3" sizes="(min-width: 1024px) 560px, (min-width: 768px) 42vw, 100vw" />}
          </div>
        </div>

        <div className="mt-12 flex justify-center border-t border-line pt-8 md:hidden">
          <ButtonLink href="/projekte" variant="secondary">
            Alle Projekte
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
