import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/content/projects";
import type { World } from "@/content/types";

export function WorldProjects({ world, number }: { world: World; number: string }) {
  const list = projects.filter((p) => p.world === world).slice(0, 3);
  return (
    <section aria-labelledby={`${world}-projects-title`} className="section-y border-t border-line">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow number={number} className="text-ink-muted">
              Referenzen
            </Eyebrow>
            <h2 id={`${world}-projects-title`} data-split className="mt-6 text-h2">
              Ausgewählte Arbeiten
            </h2>
          </div>
          <ButtonLink href="/projekte" variant="secondary">
            Alle Projekte
          </ButtonLink>
        </div>
        <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-8 gap-y-14 md:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.slug} className={i === 1 ? "md:mt-16" : ""}>
              <ProjectCard project={p} index={projects.indexOf(p)} sizes="(min-width: 768px) 33vw, 100vw" aspect="4 / 5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
