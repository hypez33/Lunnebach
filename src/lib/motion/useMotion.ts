"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "./gsap";
import { isUserReduced, markMotionReady, useMotionPreference } from "./preference";

export type MotionContext = {
  /** prefers-reduced-motion ODER eigener Schalter */
  reduce: boolean;
  /** (min-width: 1024px) */
  isDesktop: boolean;
};

type Setup = (ctx: MotionContext) => void | (() => void);

/**
 * Wrapper um useGSAP + gsap.matchMedia mit den Bedingungen des Motion-Systems.
 * Reagiert auf den Schalter „Bewegung reduzieren“ (revert + Neuaufbau).
 */
export function useMotion(
  setup: Setup,
  { scope, dependencies = [] }: { scope?: RefObject<HTMLElement | null>; dependencies?: unknown[] } = {},
) {
  const { reduced } = useMotionPreference();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)", isDesktop: "(min-width: 1024px)" },
        (ctx) => {
          const c = ctx.conditions as { reduceMotion: boolean; isDesktop: boolean };
          return setup({ reduce: c.reduceMotion || isUserReduced(), isDesktop: c.isDesktop });
        },
        scope?.current ?? undefined,
      );
      markMotionReady();
      return () => mm.revert();
    },
    { scope, dependencies: [reduced, ...dependencies], revertOnUpdate: true },
  );
}

/** Liegt das Element beim Initialisieren bereits (teilweise) im Viewport? Dann nicht verstecken. */
export function isInitiallyVisible(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.92 && r.bottom > 0;
}
