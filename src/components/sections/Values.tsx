"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marked } from "@/components/ui/Marked";
import { home } from "@/content/pages";
import { values } from "@/content/values";
import { useMotion } from "@/lib/motion/useMotion";

const MAX_MM = 2.4;
const mmFmt = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * „Haltung“ als Werkstatt-Prüfung:
 *  - Wasserwaage (dekorativ): Die Blase schlägt mit der Scroll-Geschwindigkeit aus und federt beim Stillstand
 *    ins Lot zurück; mit Maus kippt sie zusätzlich mit dem Zeiger. Anzeige „± 0,0 mm · im Lot“ live.
 *  - Die Werte stehen groß an einem Maßstab; ein Anschlag (Accent) gleitet zum aktiven Wert – aktiv ist,
 *    was die Bildmitte kreuzt (mit Maus auch per Hover). Aktive Titel treten hervor.
 * Ohne JS / reduziert: statische Liste, alle Titel in voller Stärke, Blase mittig. Keine fokussierbaren Extras.
 */
export function Values() {
  const section = useRef<HTMLElement>(null);

  useMotion(
    ({ reduce, canHover, defer, gsap, ScrollTrigger }) => {
      const root = section.current;
      if (!root || reduce) return;

      defer(() => {
        const rows = gsap.utils.toArray<HTMLElement>(".value-row", root);
        const marker = root.querySelector<HTMLElement>(".value-marker")!;
        root.classList.add("values--live");

        // Anschlag gleitet zum aktiven Wert (Position + Höhe der Zeile)
        const moveY = gsap.quickTo(marker, "y", { duration: 0.65, ease: "power3.out" });
        const sizeY = gsap.quickTo(marker, "scaleY", { duration: 0.65, ease: "power3.out" });
        let active = -1;
        const activate = (i: number) => {
          if (i === active) return;
          active = i;
          rows.forEach((r, j) => r.classList.toggle("is-current", j === i));
          gsap.to(marker, { opacity: 1, duration: 0.3, overwrite: "auto" });
          moveY(rows[i].offsetTop);
          sizeY(rows[i].offsetHeight / 100);
        };
        rows.forEach((row, i) =>
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 58%",
            onToggle: (self) => self.isActive && activate(i),
          }),
        );
        const listeners: [HTMLElement, () => void][] = [];
        if (canHover) {
          rows.forEach((row, i) => {
            const on = () => activate(i);
            row.addEventListener("pointerenter", on);
            listeners.push([row, on]);
          });
        }

        // Wasserwaage: gedämpfte Feder auf die Scroll-Geschwindigkeit (+ Zeiger)
        const level = root.querySelector<HTMLElement>(".level")!;
        const bubble = level.querySelector<HTMLElement>(".level-bubble")!;
        const tool = level.querySelector<HTMLElement>(".level-body")!;
        const readout = level.querySelector<HTMLElement>(".level-value")!;
        const stateEl = level.querySelector<HTMLElement>(".level-state")!;
        const setX = gsap.quickSetter(bubble, "x", "px");
        const setRot = gsap.quickSetter(tool, "rotation", "deg");
        let pos = 0;
        let vel = 0;
        let pointer = 0;
        let lastY = window.scrollY;
        let lastText = "";
        const tick = () => {
          const y = window.scrollY;
          const dy = y - lastY;
          lastY = y;
          const target = gsap.utils.clamp(-1, 1, dy / 28 + pointer);
          vel += (target - pos) * 0.1;
          vel *= 0.8;
          pos += vel;
          const range = (bubble.parentElement!.clientWidth - bubble.offsetWidth) / 2;
          setX(pos * range);
          setRot(pos * -0.9);
          const mm = Math.abs(pos) * MAX_MM;
          const text = mm < 0.05 ? "± 0,0" : `${pos > 0 ? "+" : "−"} ${mmFmt.format(mm)}`;
          if (text !== lastText) {
            readout.textContent = lastText = text;
            stateEl.textContent = mm < 0.05 ? "im Lot" : "außer Lot";
            level.classList.toggle("is-plumb", mm < 0.05);
          }
        };
        // Ticker nur, solange die Sektion sichtbar ist
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            lastY = window.scrollY;
            if (self.isActive) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
        });
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = root.getBoundingClientRect();
          pointer = ((e.clientX - r.left) / r.width - 0.5) * 1.1;
        };
        const onLeave = () => (pointer = 0);
        if (canHover) {
          root.addEventListener("pointermove", onMove);
          root.addEventListener("pointerleave", onLeave);
        }

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          listeners.forEach(([el, fn]) => el.removeEventListener("pointerenter", fn));
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          root.classList.remove("values--live");
          rows.forEach((r) => r.classList.remove("is-current"));
          gsap.set([marker, bubble, tool], { clearProps: "transform,opacity" });
          readout.textContent = "± 0,0";
          stateEl.textContent = "im Lot";
        };
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="values-title" className="values section-y">
      <div className="container-site grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-8 lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:col-span-5 lg:self-start">
          <Eyebrow className="text-ink-muted">{home.values.eyebrow}</Eyebrow>
          <h2 id="values-title" data-split className="mt-6 text-h2">
            <Marked text={home.values.title} mark={home.values.mark} />
          </h2>

          {/* Wasserwaage */}
          <div aria-hidden className="level is-plumb mt-[clamp(2.5rem,5vw,4.5rem)]">
            <div className="level-body">
              <span className="level-cap" />
              <span className="level-vial">
                <span className="level-lines" />
                <span className="level-bubble" />
              </span>
              <span className="level-cap" />
            </div>
            <p className="level-readout mono">
              <span className="level-value">± 0,0</span> mm · <span className="level-state">im Lot</span>
            </p>
          </div>
        </div>

        <div className="value-list relative col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="value-scale" />
          <span aria-hidden className="value-marker" />
          <ol>
            {values.map((v) => (
              <li key={v.number} className="value-row">
                <h3 className="value-title">{v.title}</h3>
                <p className="value-text">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
