import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Erklärung zur Barrierefreiheit", alternates: { canonical: "/barrierefreiheit" } };

export default function BarrierefreiheitPage() {
  return (
    <LegalPage
      eyebrow="Barrierefreiheit"
      title="Erklärung zur Barrierefreiheit"
      intro="Wir möchten, dass alle Menschen diese Website gut nutzen können – mit Maus, Tastatur, Screenreader oder Vergrößerung."
      notice="Platzhalter-Erklärung für die Demo. Stand, Prüfmethode und Kontaktwege vor Livegang finalisieren."
      sections={[
        {
          id: "stand",
          title: "Stand der Vereinbarkeit",
          body: (
            <p>
              Diese Website wurde mit dem Ziel entwickelt, die Web Content Accessibility Guidelines (WCAG) 2.2 auf Stufe AA zu erfüllen.
              Grundlage der Bewertung ist eine Selbstbewertung mit automatisierten Tests (axe) und manuellen Prüfungen mit Tastatur und
              Screenreader. Stand: [Datum].
            </p>
          ),
        },
        {
          id: "bedienung",
          title: "Bedienhilfen",
          body: (
            <>
              <p>
                <strong>Bewegung reduzieren:</strong> Über den Schalter im Fußbereich (und im Menü) schalten Sie Animationen ab. Die
                Website respektiert außerdem die Systemeinstellung „Bewegung reduzieren“.
              </p>
              <p>
                <strong>Tastatur:</strong> Alle Funktionen sind per Tastatur erreichbar. Der Link „Zum Inhalt springen“ erscheint beim
                ersten Druck auf die Tabulatortaste. In der Bildergalerie blättern Sie mit den Pfeiltasten, Escape schließt sie.
              </p>
              <p>
                <strong>Externe Inhalte:</strong> Video und Karte werden erst nach Ihrer Aktion geladen.
              </p>
            </>
          ),
        },
        {
          id: "einschraenkungen",
          title: "Bekannte Einschränkungen",
          body: (
            <ul className="grid list-disc gap-2 pl-5">
              <li>Die Alternativtexte der Bilder sind vorläufig und werden redaktionell geprüft.</li>
              <li>Das Video verfügt noch nicht über Untertitel; sie werden ergänzt.</li>
              <li>Das Logo liegt derzeit nur als Rastergrafik vor.</li>
            </ul>
          ),
        },
        {
          id: "feedback",
          title: "Feedback und Kontakt",
          body: (
            <p>
              Ist Ihnen eine Barriere aufgefallen? Schreiben Sie uns an <a href={`mailto:${site.email}`}>{site.email}</a> oder rufen Sie
              an: <a href={site.phone.href}>{site.phone.display}</a>. Wir antworten in der Regel innerhalb von {site.responseTime}.
            </p>
          ),
        },
        {
          id: "durchsetzung",
          title: "Durchsetzungsverfahren",
          body: <p>[Zuständige Marktüberwachungsbehörde nach BFSG bzw. Schlichtungsstelle ergänzen – prüfen, ob für das Unternehmen anwendbar]</p>,
        },
      ]}
    />
  );
}
