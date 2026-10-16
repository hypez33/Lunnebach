"use client";

import type { RefObject } from "react";
import { gsap, loadMotion, useGSAP, type MotionLib } from "./gsap";
import { isUserReduced, markMotionReady, useMotionPreference } from "./preference";

/** Media-Bedingungen des Motion-Systems (gsap.matchMedia) */
export const MOTION_QUERIES = {
  reduceMotion: "(prefers-reduced-motion: reduce)",
  isDesktop: "(min-width: 1024px)",
  isMobile: "(max-width: 1023px)",
  isTouch: "(hover: none) and (pointer: coarse)",
  canHover: "(hover: hover) and (pointer: fine)",
} as const;

export type MotionContext = {
  /** prefers-reduced-motion ODER eigener Schalter */
  reduce: boolean;
  /** (min-width: 1024px) */
  isDesktop: boolean;
  /** (max-width: 1023px) – Hochformat-Choreografie */
  isMobile: boolean;
  /** (hover: none) and (pointer: coarse) – Hover-Effekte bekommen ein In-View-Gegenstück */
  isTouch: boolean;
  /** (hover: hover) and (pointer: fine) */
  canHover: boolean;
} & MotionLib;

type Setup = (ctx: MotionContext) => void | (() => void);

/**
 * Wrapper um useGSAP + gsap.matchMedia mit den Bedingungen des Motion-Systems.
 * Lädt die Plugins nach (loadMotion) und reagiert auf den Schalter „Bewegung reduzieren“
 * (revert + Neuaufbau). Ändert sich eine Bedingung (Drehen, Fenstergröße), baut matchMedia neu auf.
 * Alles, was im Setup entsteht, wird beim Unmount sauber zurückgesetzt.
 */
export function useMotion(
  setup: Setup,
  { scope, dependencies = [] }: { scope?: RefObject<HTMLElement | null>; dependencies?: unknown[] } = {},
) {
  const { reduced } = useMotionPreference();

  useGSAP(
    () => {
      let alive = true;
      let mm: gsap.MatchMedia | null = null;
      loadMotion().then((lib) => {
        if (!alive) return;
        mm = gsap.matchMedia(scope?.current ?? undefined);
        mm.add(MOTION_QUERIES, (ctx) => {
          const c = ctx.conditions as Record<keyof typeof MOTION_QUERIES, boolean>;
          return setup({
            ...lib,
            reduce: c.reduceMotion || isUserReduced(),
            isDesktop: c.isDesktop,
            isMobile: c.isMobile,
            isTouch: c.isTouch,
            canHover: c.canHover,
          });
        });
        markMotionReady();
      });
      return () => {
        alive = false;
        mm?.revert();
      };
    },
    { scope, dependencies: [reduced, ...dependencies], revertOnUpdate: true },
  );
}

/**
 * Liegt das Element beim Initialisieren bereits sichtbar im Viewport? Dann nicht verstecken
 * (sonst blitzt bereits Gelesenes kurz weg). Maßstab ist der Startpunkt der Reveals (~85 %),
 * nicht die Unterkante – sonst würden auf schmalen Geräten zu viele Effekte übersprungen.
 */
export function isInitiallyVisible(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.85 && r.bottom > 0;
}
