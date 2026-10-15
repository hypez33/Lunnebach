import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { home } from "@/content/pages";
import { featuredProjects } from "@/content/projects";

/** Editorial-Layout: bewusst asymmetrisch, Bildbreiten nie über nativ 800 px (max-w). */
export function FeaturedProjects() {
  const [a, b, c, d] = featuredProjects;
  return (
    <section aria-labelledby="featured-title" className="section-y border-t border-line">
      <div className="container-site">
        <div className="grid-12 gap-y-6">
          <Eyebrow number="03" className="col-span-4 text-ink-muted md:col-span-8 lg:col-span-3">
            Projekte
          </Eyebrow>
          <h2 id="featured-title" data-split className="col-span-4 text-h2 md:col-span-6 lg:col-span-6">
            {home.featured.title}
          </h2>
          <p className="col-span-4 self-end text-lead text-ink-muted md:col-span-6 lg:col-span-3">{home.featured.intro}</p>
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,7vw,7rem)] gap-y-[clamp(4rem,8vw,8rem)]">
          {a && (
            <ProjectCard
              project={a}
              index={0}
              scrollDimension
              sizes="(min-width: 1024px) 800px, 100vw"
              className="col-span-4 max-w-[800px] md:col-span-7 lg:col-span-7"
            />
          )}
          {b && (
            <ProjectCard
              project={b}
              index={1}
              scrollDimension
              sizes="(min-width: 1024px) 520px, 100vw"
              aspect="4 / 5"
              className="col-span-4 max-w-[560px] md:col-span-5 md:mt-40 lg:col-span-4 lg:col-start-9 lg:mt-[22rem]"
            />
          )}
          {c && (
            <ProjectCard
              project={c}
              index={2}
              scrollDimension
              sizes="(min-width: 1024px) 680px, 100vw"
              className="col-span-4 max-w-[800px] md:col-span-6 lg:col-span-6 lg:col-start-2"
            />
          )}
          {d && (
            <ProjectCard
              project={d}
              index={3}
              scrollDimension
              sizes="(min-width: 1024px) 560px, 100vw"
              aspect="4 / 3"
              className="col-span-4 max-w-[640px] md:col-span-6 md:mt-24 lg:col-span-4 lg:col-start-9 lg:mt-48"
            />
          )}
        </div>

        <div className="mt-[clamp(4rem,7vw,6rem)] flex justify-center border-t border-line pt-10">
          <ButtonLink href="/projekte" variant="secondary">
            Alle Projekte
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
