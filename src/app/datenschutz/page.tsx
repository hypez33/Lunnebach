import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Datenschutz", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Datenschutz"
      intro="Diese Website kommt ohne Tracking, ohne Cookies zu Werbezwecken und ohne Cookie-Banner aus. Externe Dienste laden wir erst, wenn Sie es ausdrücklich möchten."
      notice="Muster für die Demo – muss vor Livegang durch eine fachkundige Stelle geprüft und an Hosting und Prozesse angepasst werden."
      sections={[
        {
          id: "verantwortlich",
          title: "Verantwortlicher",
          body: (
            <p>
              {site.legalName}, {site.address.street}, {site.address.zip} {site.address.city}. Telefon {site.phone.display}, E-Mail{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          ),
        },
        {
          id: "hosting",
          title: "Hosting und Server-Logfiles",
          body: (
            <p>
              Beim Aufruf der Website verarbeitet der Hoster technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene
              Seite), um die Website sicher auszuliefern. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. [Hoster, Speicherdauer und
              Auftragsverarbeitung ergänzen]
            </p>
          ),
        },
        {
          id: "schriften",
          title: "Schriftarten",
          body: <p>Alle Schriften werden von unserem eigenen Server geladen. Es findet keine Verbindung zu Google Fonts statt.</p>,
        },
        {
          id: "anfrage",
          title: "Projektanfrage und Kontakt",
          body: (
            <p>
              Ihre Angaben aus der Projektanfrage nutzen wir ausschließlich, um Ihre Anfrage zu bearbeiten (Art. 6 Abs. 1 lit. b
              DSGVO). Wir geben sie nicht an Dritte weiter. [Speicherdauer und Übertragungsweg ergänzen]
            </p>
          ),
        },
        {
          id: "bewerbung",
          title: "Bewerbungen",
          body: (
            <p>
              Bewerbungsdaten verarbeiten wir zur Durchführung des Bewerbungsverfahrens (§ 26 BDSG, Art. 6 Abs. 1 lit. b DSGVO) und
              löschen sie spätestens [sechs Monate] nach Abschluss des Verfahrens, sofern Sie keiner längeren Speicherung zustimmen.
            </p>
          ),
        },
        {
          id: "youtube",
          title: "YouTube-Video (nach Klick)",
          body: (
            <p>
              Das Video wird erst geladen, wenn Sie auf „Video abspielen“ klicken. Erst dann wird eine Verbindung zu YouTube (Google
              Ireland Ltd.) über die Domain youtube-nocookie.com hergestellt; dabei werden u. a. Ihre IP-Adresse und Geräteinformationen
              übertragen. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          ),
        },
        {
          id: "karte",
          title: "Karte (OpenStreetMap, nach Klick)",
          body: (
            <p>
              Die Karte wird erst nach Klick auf „Karte laden“ von OpenStreetMap (OpenStreetMap Foundation) geladen. Dabei wird Ihre
              IP-Adresse an deren Server übertragen. Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          ),
        },
        {
          id: "speicher",
          title: "Lokale Speicherung",
          body: (
            <p>
              Wenn Sie den Schalter „Bewegung reduzieren“ nutzen, speichern wir diese Einstellung lokal in Ihrem Browser (localStorage).
              Nach einer Projektanfrage merkt sich der Browser für die Dauer der Sitzung Ihren Vornamen, um die Bestätigung persönlich
              anzuzeigen (sessionStorage). Es werden keine Daten an uns übertragen.
            </p>
          ),
        },
        {
          id: "rechte",
          title: "Ihre Rechte",
          body: (
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und
              Widerspruch sowie das Recht, sich bei einer Aufsichtsbehörde zu beschweren – z. B. beim Landesbeauftragten für den
              Datenschutz und die Informationsfreiheit Rheinland-Pfalz.
            </p>
          ),
        },
      ]}
    />
  );
}
