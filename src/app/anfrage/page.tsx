import type { Metadata } from "next";
import { PageMotion } from "@/components/motion/PageMotion";
import { InquiryWizard } from "@/components/forms/InquiryWizard";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Projekt anfragen",
  description:
    "Erzählen Sie uns von Ihrem Raum: In vier kurzen Schritten zur unverbindlichen Projektanfrage bei der Tischlerei Lunnebach in Koblenz.",
  alternates: { canonical: "/anfrage" },
};

export default function AnfragePage() {
  return (
    <PageMotion>
      <PageHeader
        eyebrow="Projektanfrage"
        title="Erzählen Sie uns von Ihrem Raum."
        intro={`Ein paar Angaben genügen. Wir melden uns innerhalb von ${site.responseTime} und vereinbaren ein unverbindliches Gespräch.`}
        aside={
          <dl className="mono grid gap-4 text-[0.8125rem]">
            <div>
              <dt className="uppercase tracking-[0.1em] text-ink-muted">Dauer</dt>
              <dd className="mt-1">ca. 3 Minuten · 4 Schritte</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.1em] text-ink-muted">Direkt</dt>
              <dd className="mt-1">
                <a href={site.phone.href} className="link-line">
                  {site.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        }
      />
      <section aria-label="Anfrageformular" className="section-y bg-paper-2">
        <div className="container-site grid-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3">
            <InquiryWizard />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
