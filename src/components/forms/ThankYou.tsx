"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";
import { site } from "@/content/site";
import { INQUIRY_STORAGE_KEY } from "@/lib/forms/constants";

function readName() {
  try {
    return sessionStorage.getItem(INQUIRY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Persönliche Bestätigung nach der Projektanfrage (Name aus sessionStorage, ohne Namen funktioniert sie ebenso). */
export function ThankYou() {
  const name = useSyncExternalStore(
    () => () => {},
    readName,
    () => "",
  );
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <section aria-labelledby="thanks-title" className="relative overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="container-site relative grid-12 py-[clamp(4rem,10vw,10rem)]">
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <p className="eyebrow text-ink-muted">Anfrage gesendet</p>
          <div className="mt-6 max-w-[520px] pt-6">
            <Dimension label="Pos. 01 · erledigt" />
          </div>
          <h1 id="thanks-title" ref={heading} tabIndex={-1} className="mt-8 text-h1 outline-none">
            {name ? `Danke, ${name}.` : "Vielen Dank."}
            <br />
            Wir melden uns.
          </h1>
          <p className="mt-8 max-w-[52ch] text-lead text-ink-muted">
            Ihre Anfrage ist bei uns angekommen. Innerhalb von {site.responseTime} ruft Sie jemand aus unserem Team an oder
            schreibt Ihnen – für ein unverbindliches Gespräch bei Ihnen vor Ort oder in unserer Ausstellung.
          </p>
          <ol className="mt-12 grid gap-0 border-t border-line md:grid-cols-3">
            {[
              ["01", "Wir lesen Ihre Angaben", "und bereiten das erste Gespräch vor."],
              ["02", "Wir melden uns", `innerhalb von ${site.responseTime}.`],
              ["03", "Wir lernen Ihren Raum kennen", "vor Ort oder in der Ausstellung."],
            ].map(([n, t, d]) => (
              <li key={n} className="border-b border-line py-5 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                <p className="mono text-[0.8125rem] text-accent-text">{n} —</p>
                <p className="mt-3 font-medium">{t}</p>
                <p className="text-ink-muted">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/projekte">Projekte ansehen</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Zur Startseite
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
