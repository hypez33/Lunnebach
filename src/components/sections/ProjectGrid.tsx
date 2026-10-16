"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project, World } from "@/content/types";
import { DURATION, EASE } from "@/lib/motion/eases";
import { loadMotion, type MotionLib } from "@/lib/motion/gsap";
import { useMotionPreference } from "@/lib/motion/preference";

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
 * GSAP Flip verschiebt die Karten und animiert die Rasterhöhe mit.
 * Ohne JS sind alle Projekte sichtbar.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("alle");
  const { reduced } = useMotionPreference();
  const grid = useRef<HTMLUListElement>(null);
  const lib = useRef<MotionLib | null>(null);
  const flipState = useRef<ReturnType<MotionLib["Flip"]["getState"]> | null>(null);

  // Plugins nach der Hydration nachladen.
  useEffect(() => {
    let alive = true;
    loadMotion().then((l) => {
      if (alive) lib.current = l;
    });
    return () => {
      alive = false;
    };
  }, []);

  const visible = projects.filter((p) => filter === "alle" || p.world === filter);
  const count = visible.length;

  const onSelectionChange = (keys: Set<Key>) => {
    const next = [...keys][0] as Filter | undefined;
    if (!next || next === filter) return;
    if (grid.current && lib.current && !reduced) {
      // getState schließt eine laufende Flip-Animation samt Styles ab, bevor neu gemessen wird.
      flipState.current = lib.current.Flip.getState([
        grid.current,
        ...grid.current.querySelectorAll<HTMLElement>("[data-project]"),
      ]);
    }
    setFilter(next);
  };

  useLayoutEffect(() => {
    const root = grid.current;
    const l = lib.current;
    const state = flipState.current;
    flipState.current = null;
    if (!root || !l) return;
    const { Flip, gsap, ScrollTrigger } = l;
    if (!state || reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const cards = root.querySelectorAll<HTMLElement>("[data-project]");
    // Parallax und Touch-Zustände sollen erst das fertige Raster auswerten.
    const triggers = ScrollTrigger.getAll().filter((trigger) => root.contains(trigger.trigger ?? null));
    triggers.forEach((trigger) => trigger.disable(false));
    const finish = () => {
      triggers.forEach((trigger) => trigger.enable(false, false));
      ScrollTrigger.refresh();
    };
    const animation = Flip.from(state, {
      duration: DURATION.flip,
      ease: EASE.lunnebach,
      // Nur Karten absolut positionieren. Das Raster selbst bleibt im Flow und animiert seine Höhe.
      absolute: cards,
      nested: true,
      scale: false,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.45, delay: 0.12 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
      onComplete: finish,
    });
    return () => {
      // kill() allein hinterlässt absolute Positionen und Zwischenmaße.
      animation.progress(1).kill();
    };
  }, [filter, reduced]);

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
              className="press inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[2px] border-[1.5px] border-ink px-4 font-medium transition-[color,background-color,scale,opacity] duration-150 data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-3 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
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

      <ul ref={grid} className="grid-12 relative mt-[clamp(1.75rem,4vw,4rem)] gap-y-[clamp(3.5rem,7vw,7rem)]">
        {projects.map((project, index) => {
          const pos = order.get(project.slug);
          const shown = pos !== undefined;
          const slot = PATTERN[(pos ?? 0) % PATTERN.length];
          return (
            <li
              key={project.slug}
              data-project={project.slug}
              data-flip-id={project.slug}
              aria-hidden={!shown || undefined}
              inert={!shown}
              style={{ display: shown ? undefined : "none" }}
              className={`col-span-4 ${slot.cls}`}
            >
              <ProjectCard
                project={project}
                sizes={slot.sizes}
                aspect={PATTERN[index % PATTERN.length].aspect}
                reveal={false}
                headingLevel="h2"
                preload={pos === 0}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
