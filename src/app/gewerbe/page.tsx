import type { Metadata } from "next";
import { PageMotion } from "@/components/motion/PageMotion";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { WorldProjects } from "@/components/sections/WorldProjects";
import { AnchorNav } from "@/components/ui/AnchorNav";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { gewerbeServices } from "@/content/services";

export const metadata: Metadata = {
  title: "Objekteinrichtung – Ladenbau, Praxis, Büro, Hotel & Freizeit",
  description:
    "Ladenbau, Praxis- und Apothekeneinrichtung, Büroeinrichtung sowie Hotel, Gastronomie und Freizeitanlagen: Objekteinrichtung von Lunnebach aus Koblenz, inklusive Gewerke-Koordination.",
  alternates: { canonical: "/gewerbe" },
};

const trades = [
  { n: "01", title: "Planung & Aufmaß", text: "Wir planen mit Ihnen und Ihrem Architekten – auf Wunsch von der ersten Skizze an." },
  { n: "02", title: "Gewerke-Koordination", text: "Elektro, Maler und weitere Gewerke stimmen wir ab. Ein Zeitplan, ein Ansprechpartner." },
  { n: "03", title: "Fertigung & Montage", text: "Gefertigt in der eigenen Werkstatt, montiert von unserem eigenen Team – termingerecht." },
];

export default function GewerbePage() {
  return (
    <PageMotion>
      <PageHeader
        eyebrow="Gewerbe · Objekteinrichtung"
        title="Räume, in denen Unternehmen wirken."
        intro="Wir fertigen Einrichtungen für Büros, Geschäfte und Praxen – funktional, ergonomisch und stilsicher. Auch für Hotels, Bars und Freizeitanlagen entwickeln wir Lösungen, die es kein zweites Mal gibt."
        aside={<AnchorNav items={gewerbeServices} label="Leistungsbereiche Objekteinrichtung" />}
      />
      {gewerbeServices.map((s, i) => (
        <ServiceSection key={s.id} service={s} index={i} />
      ))}

      <section aria-labelledby="one-hand-title" data-theme="dark" className="theme-dark section-y">
        <div className="container-site">
          <div className="grid-12 gap-y-6">
            <Eyebrow number="05" className="col-span-4 text-paper-muted md:col-span-8 lg:col-span-3">
              Gewerke-Koordination
            </Eyebrow>
            <h2 id="one-hand-title" data-split className="col-span-4 text-h2 md:col-span-8 lg:col-span-8">
              Alles aus einer Hand.
            </h2>
          </div>
          <p className="mt-8 max-w-[56ch] text-lead text-paper-muted lg:ml-[calc(25%+0.5rem)]">
            Elektro, Maler und weitere Gewerke koordinieren wir mit – Sie haben einen Ansprechpartner.
          </p>
          <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-px bg-line-dark md:grid-cols-3">
            {trades.map((t) => (
              <li key={t.n} className="bg-ink p-[clamp(1.5rem,2.5vw,2.5rem)]">
                <p className="mono text-[0.8125rem] text-accent" aria-hidden>
                  {t.n} —
                </p>
                <h3 className="mt-8 text-h3">{t.title}</h3>
                <p className="mt-3 text-paper-muted">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WorldProjects world="gewerbe" number="06" />
      <InquiryCta number="07" />
    </PageMotion>
  );
}
