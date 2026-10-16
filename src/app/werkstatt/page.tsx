import type { Metadata } from "next";
import Image from "next/image";
import { PageMotion } from "@/components/motion/PageMotion";
import { CabinetTeaser } from "@/components/sections/CabinetTeaser";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { Values } from "@/components/sections/Values";
import { Dimension } from "@/components/ui/Dimension";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { PageHeader } from "@/components/ui/PageHeader";
import { Stat } from "@/components/ui/Stat";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { img } from "@/content/images";
import { home } from "@/content/pages";
import { processSteps } from "@/content/process";
import { site } from "@/content/site";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Werkstatt – Über uns",
  description:
    "Seit fast drei Jahrzehnten steht der Name Lunnebach in Koblenz für Innenausbau, Ladenbau, Objekteinrichtung und Möbelbau. Lernen Sie Team, Werkstatt und Arbeitsweise kennen.",
  alternates: { canonical: "/werkstatt" },
};

const groupPhoto = img("team/team-lunnebach");
const siegel = img("brand/siegel");

// [PLATZHALTER] Maschinenpark – Beispielangaben, Modelle und Fotos folgen (TODO-CONTENT.md)
const machines = [
  { name: "CNC-Bearbeitungszentrum", note: "5-Achs-Bearbeitung", dim: "B 5 200" },
  { name: "Formatkreissäge", note: "Zuschnitt", dim: "L 3 200" },
  { name: "Kantenanleimmaschine", note: "Kante & Fuge", dim: "L 6 800" },
  { name: "Bankraum & Oberflächen", note: "Handarbeit", dim: "8 Bänke" },
];

export default function WerkstattPage() {
  return (
    <PageMotion>
      <PageHeader
        eyebrow="Werkstatt · Über uns"
        title="Fest verwurzelt in Koblenz."
        intro="Koblenz ist unsere Heimat – die Stadt, aus der wir kommen und in der wir bleiben. Seit fast drei Jahrzehnten steht der Name Lunnebach hier für Innenausbau, Ladenbau, Objekteinrichtung und Möbelbau. Mit Cabinet kamen Einbauschränke nach Maß dazu."
        aside={
          <div className="flex flex-col items-start gap-4">
            <Image src={siegel.src} width={siegel.width} height={siegel.height} alt={siegel.alt} sizes="200px" className="w-[200px]" />
            <p className="text-sm text-ink-muted">Ausgezeichnet als Top-Arbeitgeber im Handwerk.</p>
          </div>
        }
      />

      {/* Team */}
      <section aria-labelledby="team-title" className="section-y">
        <div className="container-site">
          <div className="grid-12 gap-y-6">
            <Eyebrow className="col-span-4 text-ink-muted md:col-span-8 lg:col-span-3">
              Team
            </Eyebrow>
            <h2 id="team-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              Planer und Tischler unter einem Dach.
            </h2>
          </div>
          <div className="grid-12 mt-[clamp(3rem,6vw,5rem)] gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <Figure image={groupPhoto} sizes="(min-width: 1024px) 600px, 100vw" reveal="left" caption="Rund 10 Menschen, eine Werkstatt" />
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="text-lead">{home.workshop.text}</p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <Stat value={30} prefix="~" label="Jahre Erfahrung" tone="light" />
                <Stat value={10} prefix="~" label="Menschen im Team" tone="light" />
              </div>
            </div>
          </div>
          <ul className="mt-[clamp(4rem,7vw,6rem)] grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {team.map((m, i) => (
              <li key={m.id} className={i % 2 === 1 ? "lg:mt-12" : ""}>
                <Figure image={img(m.image)} sizes="(min-width: 1024px) 220px, 50vw" reveal="up" aspect="3 / 4" />
                {/* Namen erst mit Einwilligung der Abgebildeten (TODO-CONTENT.md) */}
                {!m.placeholder && <p className="mt-3 font-medium">{m.name}</p>}
                <p className={`mono text-[0.8125rem] text-ink-muted ${m.placeholder ? "mt-3" : ""}`}>{m.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prozess – Kurzform */}
      <section aria-labelledby="process-short-title" className="section-y relative border-t border-line">
        <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-45" />
        <div className="container-site relative">
          <div className="grid-12 gap-y-6">
            <Eyebrow className="col-span-4 text-ink-muted md:col-span-8 lg:col-span-3">
              Arbeitsweise
            </Eyebrow>
            <h2 id="process-short-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              Vom ersten Strich bis zur letzten Schraube.
            </h2>
          </div>
          <ol className="mt-[clamp(3rem,6vw,5rem)] grid border-t border-ink md:grid-cols-5">
            {processSteps.map((s) => (
              <li key={s.number} className="border-b border-line py-6 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                <p aria-hidden className="font-display text-[3.5rem] leading-none text-accent [font-variation-settings:'opsz'_144]">
                  {s.number}
                </p>
                <h3 className="mt-5 text-[1.375rem] leading-tight">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Maschinen */}
      <section aria-labelledby="machines-title" data-theme="dark" className="theme-dark section-y">
        <div className="container-site">
          <div className="grid-12 gap-y-6">
            <Eyebrow className="col-span-4 text-paper-muted md:col-span-8 lg:col-span-3">
              Maschinen
            </Eyebrow>
            <h2 id="machines-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              CNC-Präzision und Handarbeit.
            </h2>
          </div>
          <p className="mt-8 max-w-[56ch] text-lead text-paper-muted lg:ml-[calc(25%+0.5rem)]">
            Millimetergenau auf unserer CNC-Anlage, veredelt von Hand im Bankraum. Was die Maschine präzise vorgibt, vollendet die Hand.
          </p>
          <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {machines.map((m, i) => (
              <li key={m.name}>
                <div className="relative pt-8">
                  <div className="absolute inset-x-0 top-0">
                    <Dimension label={m.dim} className="on-dark" />
                  </div>
                  <div className="wood-fill grain relative flex aspect-[4/5] items-end p-4" data-clip="up">
                    <span className="mono bg-ink/80 px-2 py-1 text-[0.75rem] text-paper">Foto folgt · Pos. {String(i + 1).padStart(2, "0")}</span>
                  </div>
                </div>
                <h3 className="mt-5 text-[1.375rem] leading-tight">{m.name}</h3>
                <p className="mono mt-1 text-[0.8125rem] text-paper-muted">{m.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(4rem,8vw,8rem)] grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <p className="eyebrow text-paper-muted">Film</p>
              <h2 className="mt-5 text-h3">Einblick in die Werkstatt</h2>
              <p className="mt-4 max-w-[40ch] text-paper-muted">
                Wie aus Plänen Möbel werden: ein kurzer Einblick in unsere Arbeit in Koblenz.
              </p>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
              <VideoEmbed id={site.youtubeId} title="Lunnebach – Einblick in die Werkstatt (YouTube)" poster={img("team/lunnebach-team2")} />
            </div>
          </div>
        </div>
      </section>

      <Values />
      <CabinetTeaser />
      <InquiryCta />
    </PageMotion>
  );
}
