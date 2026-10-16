"use client";

import { useRef } from "react";
import { EASE } from "@/lib/motion/eases";
import { useMotion } from "@/lib/motion/useMotion";

/**
 * Zwei Schiebetürflügel über dem Cabinet-Bild (dekorativ). Sie gleiten an den Scroll gekoppelt auseinander
 * (scrub) – die Tür „öffnet sich“ unter dem Finger bzw. dem Mausrad. Die Flügel existieren nur mit voller
 * Bewegung (.is-live); ohne JS oder reduziert ist das Bild sofort frei. Nur transform wird animiert.
 */
export function CabinetDoors() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ reduce, defer, gsap }) => {
      const el = root.current;
      if (!el || reduce) return;
      defer(() => {
        el.classList.add("is-live");
        const [a, b] = el.querySelectorAll<HTMLElement>(".cabinet-leaf");
        const handles = el.querySelectorAll<HTMLElement>(".cabinet-handle");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 80%", end: "center 42%", scrub: 0.5 },
        });
        // erst ein kurzer Ruck am Griff, dann gleiten die Flügel – wie eine echte Schiebetür
        tl.to(handles, { scaleY: 1.25, duration: 0.08, ease: EASE.out }, 0)
          .to(a, { xPercent: -101, duration: 1 }, 0.06)
          .to(b, { xPercent: 101, duration: 1 }, 0.06);
        return () => el.classList.remove("is-live");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="cabinet-doors">
      <div className="cabinet-leaf cabinet-leaf--a">
        <span className="cabinet-handle" />
        <span className="cabinet-tag mono">Tür A · 1 200</span>
      </div>
      <div className="cabinet-leaf cabinet-leaf--b">
        <span className="cabinet-handle" />
        <span className="cabinet-tag mono">Tür B · 1 200</span>
      </div>
    </div>
  );
}
