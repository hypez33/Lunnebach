import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { img } from "@/content/images";
import { worldLabel } from "@/content/projects";
import type { Project } from "@/content/types";
import { Dimension } from "./Dimension";

type Props = {
  project: Project;
  index: number;
  sizes: string;
  aspect?: string;
  className?: string;
  /** Maßkette, die sich beim Scrollen zeichnet (Moment 2) */
  scrollDimension?: boolean;
  headingLevel?: "h2" | "h3";
  preload?: boolean;
  /** clip-path-Reveal beim Scrollen (aus bei gefilterten Rastern) */
  reveal?: boolean;
};

/**
 * Projektkarte. Hover/Fokus: Bild skaliert minimal (1.03), Maßkette zeigt sich an der Kante,
 * Titel-Linie läuft durch. Bild ist View-Transition-Quelle für den Detail-Hero (Moment 4).
 */
export function ProjectCard({
  project,
  index,
  sizes,
  aspect,
  className = "",
  scrollDimension = false,
  headingLevel: H = "h3",
  preload,
  reveal = true,
}: Props) {
  const image = img(project.heroImage);
  const vertical = project.dimension.orientation === "vertical";
  return (
    <article className={`project-card group relative ${className}`}>
      <div className={`relative ${scrollDimension ? (vertical ? "pr-8" : "pt-8") : ""}`}>
        {scrollDimension && (
          <div className={vertical ? "absolute bottom-0 right-0 top-0" : "absolute inset-x-0 top-0"}>
            <Dimension label={project.dimension.label} orientation={project.dimension.orientation} side="start" />
          </div>
        )}
        <div data-clip={reveal ? "up" : undefined} className="relative overflow-hidden bg-paper-2">
          <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
            <div className="grain relative" style={{ aspectRatio: aspect ?? `${image.width} / ${image.height}` }}>
              <Image
                src={image.src}
                alt=""
                fill
                sizes={sizes}
                preload={preload}
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                quality={85}
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo-out)] group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
              />
            </div>
          </ViewTransition>
          {/* Hover-Maßkette an der Bildunterkante */}
          <div className="card-dim pointer-events-none absolute inset-x-4 bottom-4 z-10">
            <Dimension label={project.dimension.label.replace(/^H /, "")} animate={false} className="on-image" side="start" />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <p className="mono flex flex-wrap gap-x-3 text-[0.75rem] uppercase tracking-[0.1em] text-ink-muted">
          <span>Pos. {String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden>·</span>
          <span>
            {worldLabel[project.world]} · {project.category}
          </span>
          <span aria-hidden>·</span>
          <span>{project.location}</span>
        </p>
        <H className="text-h3">
          <Link
            href={`/projekte/${project.slug}`}
            transitionTypes={["nav-forward"]}
            className="card-title-link outline-none after:absolute after:inset-0 after:z-20"
          >
            <span className="card-title">{project.title}</span>
          </Link>
        </H>
        <p className="max-w-[48ch] text-ink-muted">{project.teaser}</p>
      </div>
    </article>
  );
}
