"use client";

/**
 * Zentrale GSAP-Registrierung. Nur aus Client Components importieren.
 *
 * Kern + useGSAP werden statisch geladen (klein). Die Plugins (ScrollTrigger, SplitText, DrawSVG,
 * Flip, CustomEase – alle kostenlos, auch kommerziell) lädt `loadMotion()` erst nach der Hydration
 * nach und registriert sie genau einmal. So bleiben sie aus dem kritischen Pfad für LCP/TBT.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EASE, LUNNEBACH_EASE_CURVE } from "./eases";

gsap.registerPlugin(useGSAP);
gsap.defaults({ ease: EASE.reveal });

export type MotionLib = {
  gsap: typeof gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
  Flip: typeof import("gsap/Flip").Flip;
};

let pending: Promise<MotionLib> | null = null;

export function loadMotion(): Promise<MotionLib> {
  if (!pending) {
    pending = Promise.all([
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("gsap/DrawSVGPlugin"),
      import("gsap/Flip"),
      import("gsap/CustomEase"),
    ]).then(([{ ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, { Flip }, { CustomEase }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase);
      CustomEase.create(EASE.lunnebach, LUNNEBACH_EASE_CURVE);
      return { gsap, ScrollTrigger, SplitText, Flip };
    });
  }
  return pending;
}

export { gsap, useGSAP };
