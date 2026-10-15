import type { Metadata } from "next";
import { PageMotion } from "@/components/motion/PageMotion";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Ausgewählte Arbeiten der Tischlerei Lunnebach: Küchen, Wohnmöbel, Einbauschränke und Bäder sowie Ladenbau, Büro- und Objekteinrichtung wie die Emser Therme.",
  alternates: { canonical: "/projekte" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projekte"
        title="Arbeiten, die es nur einmal gibt."
        intro="Jedes Projekt beginnt mit einem Gespräch und endet mit einem Raum, der funktioniert. Eine Auswahl aus Wohnräumen und Objekteinrichtung."
      />
      <section aria-label="Projektübersicht" className="section-y pt-[clamp(2.5rem,5vw,4rem)]">
        <div className="container-site">
          <ProjectGrid projects={projects} />
        </div>
      </section>
      <InquiryCta number="02" showMap={false} />
      <PageMotion />
    </>
  );
}
