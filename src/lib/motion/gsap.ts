"use client";

/**
 * Zentrale GSAP-Registrierung. Nur aus Client Components importieren.
 * Alle Plugins sind seit GSAP 3.13 kostenlos (auch kommerziell).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { EASE, LUNNEBACH_EASE_CURVE } from "./eases";

let registered = false;

function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase);
  CustomEase.create(EASE.lunnebach, LUNNEBACH_EASE_CURVE);
  gsap.defaults({ ease: EASE.reveal });
  registered = true;
}

register();

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase, useGSAP };
