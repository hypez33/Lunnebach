"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project, World } from "@/content/types";
import { DURATION, EASE } from "@/lib/motion/eases";
import { Flip, gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { isMotionReduced } from "@/lib/motion/preference";

type Filter = "alle" | World;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "privat", label: "Privat" },
  { id: "gewerbe", label: "Gewerbe" },
];

/** Editorial-Raster: wiederkehrendes, asymmetrisches Muster aus Spaltenbreiten und Versätzen */
const PATTERN = [
  { cls: "md:col-span-8 lg:col-span-7", aspect: "4 / 3", sizes: "(min-width: 1024px) 800px, 100vw" },
  { cls: "md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-40", aspect: "4 / 5", sizes: "(min-width: 1024px) 460px, 100vw" },
  { cls: "md:col-span-6 lg:col-span-5 lg:col-start-2", aspect: "1 / 1", sizes: "(min-width: 1024px) 560px, 100vw" },
  { cls: "md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-24", aspect: "3 / 2", sizes: "(min-width: 1024px) 680px, 100vw" },
];

/**
 * Moment 4 – Projektübersicht mit Filter (Alle / Privat / Gewerbe).
 * Umsortieren mit GSAP Flip; ohne JS sind alle Projekte sichtbar.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("alle");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = projects.filter((p) => filter === "alle" || p.world === filter);
  const count = visible.length;

  const onSelectionChange = (keys: Set<Key>) => {
    const next = [...keys][0] as Filter | undefined;
    if (!next || next === filter) return;
    if (grid.current && !isMotionReduced()) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip]"));
    }
    setFilter(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !grid.current) return;
    const tl = Flip.from(state, {
      duration: DURATION.flip,
      ease: EASE.lunnebach,
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15, ease: EASE.out }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    return () => {
      tl.kill();
    };
  }, [filter]);

  const order = new Map(visible.map((p, i) => [p.slug, i]));

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <ToggleButtonGroup
          aria-label="Projekte filtern"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([filter])}
          onSelectionChange={onSelectionChange}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => (
            <ToggleButton
              key={f.id}
              id={f.id}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[2px] border-[1.5px] border-ink px-4 font-medium transition-colors data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-3 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
            >
              {f.label}
              <span className="mono text-xs opacity-70">
                {f.id === "alle" ? projects.length : projects.filter((p) => p.world === f.id).length}
              </span>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <p role="status" aria-live="polite" className="mono text-[0.8125rem] text-ink-muted">
          {count} {count === 1 ? "Projekt" : "Projekte"}
          {filter !== "alle" && ` · ${filter === "privat" ? "Privat" : "Gewerbe"}`}
        </p>
      </div>

      <ul ref={grid} className="grid-12 mt-[clamp(3rem,6vw,6rem)] gap-y-[clamp(3.5rem,7vw,7rem)]">
        {projects.map((project) => {
          const pos = order.get(project.slug);
          const shown = pos !== undefined;
          const slot = PATTERN[(pos ?? 0) % PATTERN.length];
          return (
            <li
              key={project.slug}
              data-flip={project.slug}
              data-flip-id={project.slug}
              hidden={!shown}
              className={`col-span-4 ${slot.cls}`}
            >
              <ProjectCard
                project={project}
                index={projects.indexOf(project)}
                sizes={slot.sizes}
                aspect={slot.aspect}
                reveal={false}
                headingLevel="h2"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
