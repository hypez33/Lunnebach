"use client";

import { useRef } from "react";
import { EASE } from "@/lib/motion/eases";
import { isInitiallyVisible, useMotion } from "@/lib/motion/useMotion";

export function HeroTeamMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useMotion(({ reduce, isDesktop, canHover, defer, gsap, ScrollTrigger }) => {
    const root = scope.current;
    if (!root || !isDesktop || reduce) return;

    defer(() => {
      const frame = root.querySelector<HTMLElement>("[data-team-reveal]")!;
      const depth = root.querySelector<HTMLElement>("[data-team-scroll]")!;
      const pointer = root.querySelector<HTMLElement>("[data-team-pointer]")!;
      const marks = root.querySelector(".hero-team-marks path")!;
      const reveal = gsap.timeline({ paused: true, delay: isInitiallyVisible(root) ? 0.7 : 0 });
      reveal.fromTo(frame, { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: EASE.reveal, clearProps: "clipPath",
      }, 0).fromTo(marks, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.8, ease: EASE.lunnebach }, 0.1);
      ScrollTrigger.create({ trigger: root, start: "top 90%", once: true, onEnter: () => { reveal.play(); } });

      // Scroll und Maus bewegen getrennte Ebenen, damit sich ihre Transformationen nicht überschreiben.
      gsap.fromTo(depth, { y: 10 }, {
        y: -10, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
      if (!canHover) return;

      const toX = gsap.quickTo(pointer, "x", { duration: 0.6, ease: EASE.out });
      const toY = gsap.quickTo(pointer, "y", { duration: 0.6, ease: EASE.out });
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const box = frame.getBoundingClientRect();
        const x = gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width - 0.5) * 2);
        const y = gsap.utils.clamp(-1, 1, ((event.clientY - box.top) / box.height - 0.5) * 2);
        toX(x * 7);
        toY(y * 4);
      };
      const reset = () => { toX(0); toY(0); };
      frame.addEventListener("pointermove", move);
      frame.addEventListener("pointerleave", reset);
      frame.addEventListener("pointercancel", reset);
      return () => {
        frame.removeEventListener("pointermove", move);
        frame.removeEventListener("pointerleave", reset);
        frame.removeEventListener("pointercancel", reset);
      };
    });
  }, { scope });

  return <div ref={scope} className="hero-team">{children}</div>;
}
