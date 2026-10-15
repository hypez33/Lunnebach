import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Impressum"
      notice="Platzhalter für die Demo. Alle Angaben in [eckigen Klammern] müssen vor Livegang ergänzt und rechtlich geprüft werden."
      sections={[
        {
          id: "anbieter",
          title: "Angaben gemäß § 5 DDG",
          body: (
            <>
              <p>
                <strong>{site.legalName}</strong>
                <br />
                Inhaber: Rolf Lunnebach
                <br />
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </p>
            </>
          ),
        },
        {
          id: "kontakt",
          title: "Kontakt",
          body: (
            <p>
              Telefon: <a href={site.phone.href}>{site.phone.display}</a>
              <br />
              E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          ),
        },
        {
          id: "beruf",
          title: "Berufsrechtliche Angaben",
          body: (
            <>
              <p>Berufsbezeichnung: Tischlermeister (verliehen in der Bundesrepublik Deutschland)</p>
              <p>Zuständige Kammer: [Handwerkskammer Koblenz – prüfen], Eintragung in die Handwerksrolle: [Nr.]</p>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [DE …]</p>
            </>
          ),
        },
        {
          id: "streit",
          title: "Verbraucherstreitbeilegung",
          body: <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. [Prüfen]</p>,
        },
        {
          id: "haftung",
          title: "Haftung für Inhalte und Links",
          body: (
            <p>
              Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für Inhalte externer Links sind ausschließlich deren Betreiber
              verantwortlich. [Haftungsausschluss der bisherigen Website übernehmen und prüfen]
            </p>
          ),
        },
        {
          id: "bildnachweis",
          title: "Bildnachweis",
          body: <p>Fotos: Rolf Lunnebach – die creative Holzwerkstätte. [Fotografen ergänzen]</p>,
        },
      ]}
    />
  );
}
