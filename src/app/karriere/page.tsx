import type { Metadata } from "next";
import Image from "next/image";
import { PageMotion } from "@/components/motion/PageMotion";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { UniqueRow } from "@/components/ui/UniqueRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { img } from "@/content/images";
import { benefits, jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Karriere – Jobs und Ausbildung in der Tischlerei",
  description:
    "Arbeite da, wo Unikate entstehen: offene Stellen als Tischlermeister, Holztechniker, Tischler in der Produktion und Ausbildung zum Tischler bei Lunnebach in Koblenz.",
  alternates: { canonical: "/karriere" },
};

const siegel = img("brand/siegel");

export default function KarrierePage() {
  return (
    <PageMotion>
      <PageHeader
        eyebrow="Karriere"
        title="Arbeite da, wo Unikate entstehen."
        intro="Von der Idee über Planung und Fertigung bis zur Montage – bei uns bist du an jedem Schritt beteiligt. Wir legen hohe Maßstäbe an uns selbst, und wir bilden gern aus, denn gute Leute brauchen wir immer."
        aside={
          <div className="flex flex-col items-start gap-4">
            <Image src={siegel.src} width={siegel.width} height={siegel.height} alt={siegel.alt} sizes="200px" className="w-[200px]" />
            <a href="#stellen" className="btn btn-primary">
              <span className="btn-label">Offene Stellen</span>
            </a>
          </div>
        }
      />

      {/* Benefits */}
      <section aria-labelledby="benefits-title" className="section-y">
        <div className="container-site grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <Eyebrow className="text-ink-muted">
              Was dich erwartet
            </Eyebrow>
            <h2 id="benefits-title" data-split className="mt-6 text-h2">
              Keine Serie. Nur Einzelstücke.
            </h2>
            <ol className="mt-10 border-t border-line">
              {benefits.map((b, i) => (
                <li key={b} className="flex gap-5 border-b border-line py-4 text-lead">
                  <span aria-hidden className="mono pt-1.5 text-[0.8125rem] text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {b}
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-4 grid grid-cols-2 items-start gap-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <Figure image={img("team/team3")} sizes="(min-width: 1024px) 320px, 50vw" reveal="up" />
            <Figure image={img("team/team5")} sizes="(min-width: 1024px) 320px, 50vw" reveal="up" className="mt-20" />
            <Figure image={img("team/lunnebach-team2")} sizes="(min-width: 1024px) 600px, 100vw" reveal="left" className="col-span-2" />
          </div>
          {/* Keine Serie: identische Rohlinge werden beim Scrollen zu sechs verschiedenen Möbeln */}
          <UniqueRow className="col-span-4 mt-[clamp(1rem,4vw,4rem)] md:col-span-8 lg:col-span-12" />
        </div>
      </section>

      {/* Stellen */}
      <section id="stellen" aria-labelledby="jobs-title" className="section-y scroll-mt-[var(--header-h)] border-t border-line">
        <div className="container-site">
          <div className="grid-12 gap-y-6">
            <Eyebrow className="col-span-4 text-ink-muted md:col-span-8 lg:col-span-3">
              Offene Stellen
            </Eyebrow>
            <h2 id="jobs-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              Wir suchen Verstärkung.
            </h2>
          </div>
          <ul className="mt-[clamp(3rem,6vw,5rem)] border-t border-ink">
            {jobs.map((job, i) => (
              <li key={job.slug} className="border-b border-line">
                <details className="job group">
                  <summary className="grid min-h-11 cursor-pointer list-none [&::-webkit-details-marker]:hidden grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[4rem_1fr_14rem_auto]">
                    <span aria-hidden className="mono text-[0.8125rem] text-accent-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-h3">{job.title}</span>
                      <span className="mt-1 block text-ink-muted">{job.summary}</span>
                    </span>
                    <span className="mono col-start-2 text-[0.8125rem] text-ink-muted md:col-start-auto">{job.type}</span>
                    <span
                      aria-hidden
                      className="col-start-3 row-start-1 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink transition-transform duration-500 group-open:rotate-45 md:col-start-4"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </summary>
                  <div className="grid gap-8 pb-10 md:grid-cols-3 md:pl-[calc(4rem+1.25rem)]">
                    {[
                      { title: "Deine Aufgaben", items: job.tasks },
                      { title: "Dein Profil", items: job.profile },
                      { title: "Unser Angebot", items: job.offer },
                    ].map((col) => (
                      <div key={col.title}>
                        <h3 className="eyebrow !font-mono !tracking-[0.12em] text-ink-muted">{col.title}</h3>
                        <ul className="mt-4 grid gap-2">
                          {col.items.map((t) => (
                            <li key={t} className="flex gap-3">
                              <span aria-hidden className="text-accent-text">
                                –
                              </span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="md:col-span-3">
                      <a href="#bewerbung" className="text-link font-medium">
                        Jetzt kurz bewerben
                      </a>
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ausbildung */}
      <section aria-labelledby="training-title" data-theme="dark" className="theme-dark section-y">
        <div className="container-site grid-12 items-center gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <Eyebrow className="text-paper-muted">
              Ausbildung
            </Eyebrow>
            <h2 id="training-title" data-split className="mt-6 text-h2">
              Drei Jahre, die dich zum Tischler machen.
            </h2>
            <p className="mt-6 max-w-[50ch] text-lead text-paper-muted">
              Dual, mit festen Ansprechpartnern und von Anfang an an echten Kundenaufträgen. Am besten lernst du uns bei einem
              Praktikum kennen – melde dich einfach.
            </p>
            <dl className="mono mt-10 grid grid-cols-3 border-t border-line-dark text-[0.8125rem]">
              {[
                ["Dauer", "3 Jahre"],
                ["Form", "dual"],
                ["Start", "jedes Jahr zum 1. August"],
              ].map(([k, v]) => (
                <div key={k} className="border-r border-line-dark py-4 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4">
                  <dt className="uppercase tracking-[0.1em] text-paper-muted">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <Figure image={img("team/team9")} sizes="(min-width: 1024px) 375px, 100vw" reveal="door" className="mx-auto" />
          </div>
        </div>
      </section>

      <ApplicationSection />
    </PageMotion>
  );
}
