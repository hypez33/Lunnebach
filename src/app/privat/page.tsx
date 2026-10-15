import type { Metadata } from "next";
import { PageMotion } from "@/components/motion/PageMotion";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { WorldProjects } from "@/components/sections/WorldProjects";
import { AnchorNav } from "@/components/ui/AnchorNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { privatServices } from "@/content/services";

export const metadata: Metadata = {
  title: "Wohnräume – Küchen, Möbel und Einbauschränke nach Maß",
  description:
    "Tischlerküchen, Wohn- und Schlafzimmermöbel, Einbaumöbel, Badmöbel und Outdoor aus der Werkstatt Lunnebach in Koblenz – geplant, gefertigt und montiert aus einer Hand.",
  alternates: { canonical: "/privat" },
};

export default function PrivatPage() {
  return (
    <PageMotion>
      <PageHeader
        eyebrow="Privat · Wohnräume"
        title="Wohnräume, die zu Ihnen passen."
        intro="Freuen Sie sich auf Räume, die Ihrem Stil entsprechen, auf durchdachte Planung, effiziente Fertigung und saubere Montage."
        aside={<AnchorNav items={privatServices} label="Leistungsbereiche Wohnräume" />}
      />
      {privatServices.map((s, i) => (
        <ServiceSection key={s.id} service={s} index={i} />
      ))}
      <WorldProjects world="privat" number="06" />
      <InquiryCta number="07" />
    </PageMotion>
  );
}
