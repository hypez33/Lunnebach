# TODO-CONTENT – offene Inhalte, Freigaben und Bilder

Stand der Demo: alle Platzhalter sind im Code mit `[eckigen Klammern]` oder `placeholder: true` markiert.
Inhalte liegen in `src/content/*.ts` (später Payload CMS).

## 1. Marke & Logo

- [ ] **Logo als SVG anfordern.** Derzeit nur PNG (`logo-2.png` 200 × 46, `logo-weiss-orange.png` 300 × 69) – auf Retina-Displays leicht unscharf. Zwei Varianten (hell/dunkel) werden per CSS umgeschaltet.
- [ ] Signet „Rolf Lunnebach“ mit Werkzeugsymbolen ebenfalls als SVG (`rolf_lunnebach_weiss.png`).
- [ ] Akzentfarbe `#E46929` wurde per Pixelanalyse aus dem Logo ermittelt – mit Hausfarbe/Druckvorlage abgleichen.
- [ ] Siegel „Top Arbeitgeber“ (ZuFa ’18 Check): Gültigkeit/Jahr prüfen, ggf. aktuelles Siegel liefern.

## 2. Texte und Fakten (Platzhalter)

| Stelle | Datei | Platzhalter |
|---|---|---|
| Antwortzeit „innerhalb von zwei Werktagen“ | `src/content/site.ts` (`responseTime`) | Zusage prüfen |
| Öffnungszeiten (Footer, JSON-LD) | `src/content/site.ts` | komplett Platzhalter |
| Geo-Koordinaten Alemannenstraße 21 (Karte, JSON-LD) | `src/content/site.ts` | näherungsweise, exakt ermitteln |
| Zahl „0,1 mm CNC-Genauigkeit“ | `src/content/pages.ts` | Wert prüfen |
| „~30 Jahre“, „~10 Menschen“ | `src/content/pages.ts` | Stand prüfen |
| Emser Therme – Ergebnis „[PLATZHALTER: Umfang, Jahr]“, Jahr | `src/content/projects.ts` | ergänzen |
| Friseursalon – Kundenname, Kundenzitat, Jahr | `src/content/projects.ts` | **nur nach Freigabe** des Kunden |
| Projekte Küche, Bibliothek, Büro, Schrankwand, Bad, Garten – Story (Aufgabe/Lösung/Ergebnis) | `src/content/projects.ts` | im Ton geschrieben, **inhaltlich erfunden** – durch echte Projektdaten ersetzen |
| Ort `[Ort]` und Jahr `[Jahr]` aller Projekte | `src/content/projects.ts` | ergänzen |
| Teamnamen und Rollen `[Name]`, `[Rolle]` | `src/content/team.ts` | ergänzen + **Einwilligung der abgebildeten Personen** |
| Ausbildungsstart „[jährlich, 1. August]“ | `src/app/karriere/page.tsx` | prüfen |
| Maschinenpark (Modelle, Fotos, Maße) | `src/app/werkstatt/page.tsx` | komplett Platzhalter, Fotos folgen |
| Videoinhalt „Einblick in die Werkstatt“ (YouTube `RBPyLdsKxfs`) | `Workshop.tsx`, `werkstatt/page.tsx` | Titel/Inhalt des Videos bestätigen, Untertitel ergänzen |
| Impressum: Kammer, Handwerksrolle, USt-IdNr., Bildnachweis | `src/app/impressum/page.tsx` | **rechtlich prüfen** |
| Datenschutzerklärung (Hoster, Speicherdauer, Übertragungsweg) | `src/app/datenschutz/page.tsx` | Muster – **rechtlich prüfen** |
| Erklärung zur Barrierefreiheit (Stand, Durchsetzungsverfahren) | `src/app/barrierefreiheit/page.tsx` | Muster – finalisieren |
| Budgetstufen und Zeiträume im Anfrage-Wizard | `src/lib/forms/inquiry.ts` | mit Vertrieb abstimmen |

## 3. Maßketten (illustrativ)

Alle Maßangaben in den `<Dimension>`-Komponenten sind **dekorativ und frei gewählt** (z. B. `H 2 180` an der Vitrine,
`12 400` an der Emser Therme, `Schiebetür · 2 × 1 200` bei Cabinet). Sie sind `aria-hidden`. Entweder echte Maße
aus den Werkplänen übernehmen oder bewusst als Gestaltungsmittel belassen.

- `src/components/sections/Hero.tsx` – `H 2 180`
- `src/content/projects.ts` – `dimension.label` je Projekt
- `src/content/services.ts` – `dimension` je Leistungsbereich
- `src/components/sections/CabinetTeaser.tsx`, `src/app/werkstatt/page.tsx` (Maschinen)

## 4. Funktionen, die vor Livegang angebunden werden müssen

- [ ] Projektanfrage und Bewerbung: Server Actions validieren und loggen nur (`src/lib/forms/actions.ts`). Versand (E-Mail/CRM) und Speicherung fehlen.
- [ ] Datei-Upload (Fotos/Grundriss, Lebenslauf) ist in der Demo **nur clientseitig** – kein Upload.
- [ ] Spam-Schutz: Honeypot vorhanden; ggf. Rate-Limit serverseitig ergänzen.

## 5. Bilder – hochaufgelöster Ersatz nötig

**Kein einziges Bild der alten Website erreicht 1 600 px Breite.** Die größten sind 800 × 600 px, das Hero-Bild
(`moebelbau-vitrine.jpg`) nur 450 × 700 px. Die Demo kaschiert das (Bilder nie breiter als nativ, gerahmte
Kompositionen, Grain-Overlay, Split-Layouts) – für den Livegang sind neue Fotos bzw. Originaldateien nötig.

**Priorität A – prominent eingesetzt, bitte zuerst in ≥ 2 400 px liefern:**

| Bild | Maße | Einsatz |
|---|---|---|
| `hero/moebelbau-vitrine.jpg` | 450 × 700 | Hero Startseite, OG-Bild |
| `gewerbe/emser-therme/ems-lounge.jpg` | 800 × 600 | Projekt-Hero, Zwei Welten |
| `privat/kueche/kueche-nussbaum.jpg` | 799 × 600 | Projekt-Hero, Prozess |
| `gewerbe/friseursalon/friseursalon-7.jpg` | 800 × 600 | Projekt-Hero |
| `privat/wohnen/innenausbau-02.jpg` | 800 × 498 | Projekt-Hero |
| `privat/wohnen/wohnzimmer-schrankwand.jpg` | 600 × 400 | Zwei Welten |
| `team/team-lunnebach.jpg` | 600 × 400 | Werkstatt |
| `team/lunnebach-team2.webp` | 600 × 400 | Prozess, Video-Vorschau |

**Priorität B – sehr klein, nur als Detail nutzbar (193 px breit):** `gewerbe/ladenbau/*` (außer Delikatessen/Koblenz),
`privat/einbau/raumtrenner.jpg`, `schrank-schraege.jpg`, `schrankwand-hoch.jpg`.

**Nicht eingesetzt / Banner-Ausschnitte:** die 700 × 85- und 600 × 200-Streifen (`spec-cont-*`, `acc-*`, `cc-*`,
`*-individuell.jpg`) sind Ausschnitte der alten Seite; als Inhaltsbilder ungeeignet. Ausnahme: `gewerbe/acc-prax.jpg`
in der Praxis-Galerie, weil es dort kaum Material gibt.

**Fehlend:** eigene Bilder für **Praxis & Apotheke** (derzeit Friseur-/Showroom-Motive), **Maschinenpark/CNC**,
**Ausstellung Cabinet**, **Porträt Rolf Lunnebach** (Zuordnung `team1.jpg` unklar).

## 6. Alt-Texte

Alle Alt-Texte in `src/content/images.ts` sind aus Dateiname, Kategorie und Sichtung geschrieben und mit
`altReviewed: false` markiert → redaktionell prüfen (Quelle der Texte: `scripts/build-image-manifest.mjs`, Objekt `ALT`).

<details>
<summary>Alle 96 Inhaltsbilder mit Maßen (aufsteigend nach Fläche)</summary>

| Bild | Maße | Einsatz |
|---|---|---|
| `gewerbe/ladenbau/ladenbau-friseur-counter.jpg` | 193 × 271 |  |
| `gewerbe/ladenbau/ladenbau-friseur.jpg` | 193 × 271 |  |
| `gewerbe/ladenbau/ladenbau-tee.jpg` | 193 × 271 |  |
| `privat/einbau/schrankwand-hoch.jpg` | 193 × 272 |  |
| `gewerbe/ladenbau/counter.jpg` | 193 × 289 |  |
| `gewerbe/ladenbau/display-close.jpg` | 193 × 289 |  |
| `gewerbe/ladenbau/wanddisplay.jpg` | 193 × 289 |  |
| `privat/einbau/raumtrenner.jpg` | 193 × 289 |  |
| `privat/einbau/schrank-schraege.jpg` | 193 × 289 |  |
| `gewerbe/bueroeinrichtung-individuell.jpg` | 700 × 85 |  |
| `gewerbe/freizeit-spec.jpg` | 700 × 85 |  |
| `gewerbe/ladenbau-individuell.jpg` | 700 × 85 |  |
| `gewerbe/praxiseinrichtung-individuell.jpg` | 700 × 85 |  |
| `privat/kuechenmoebel.jpg` | 700 × 85 |  |
| `privat/spec-cont-bad.jpg` | 700 × 85 |  |
| `privat/spec-cont-einbau.jpg` | 700 × 85 |  |
| `privat/spec-cont-garten.jpg` | 700 × 85 |  |
| `privat/spec-cont-moebel.jpg` | 700 × 85 |  |
| `gewerbe/acc-buero.jpg` | 600 × 200 |  |
| `gewerbe/acc-freizeitanlagen.jpg` | 600 × 200 |  |
| `gewerbe/acc-obj.jpg` | 600 × 200 |  |
| `gewerbe/acc-prax.jpg` | 600 × 200 |  |
| `privat/acc-einbauschrank.jpg` | 600 × 200 |  |
| `privat/acc-kueche.jpg` | 600 × 200 |  |
| `privat/acc-outdoor-1.jpg` | 600 × 200 |  |
| `privat/cc-bad.jpg` | 600 × 200 |  |
| `privat/cc-moebel.jpg` | 600 × 200 |  |
| `privat/bad/bad-waschbecken.jpg` | 337 × 600 |  |
| `team/team1.jpg` | 375 × 600 |  |
| `team/team2.jpg` | 375 × 600 |  |
| `team/team3.jpg` | 375 × 600 |  |
| `team/team4.jpg` | 375 × 600 |  |
| `team/team5.jpg` | 375 × 600 |  |
| `team/team9.jpg` | 375 × 600 |  |
| `privat/outdoor/garten-terrassenbau.jpg` | 600 × 398 |  |
| `gewerbe/buero/buero-totale.jpg` | 600 × 400 |  |
| `gewerbe/buero/bueroanlage-ecke.jpg` | 400 × 600 |  |
| `gewerbe/buero/bueroanlage-gesamtansicht.jpg` | 600 × 400 |  |
| `gewerbe/buero/bueroanlage-medienschrank.jpg` | 400 × 600 |  |
| `gewerbe/buero/konferenztisch-1.jpg` | 600 × 400 |  |
| `gewerbe/buero/konferenztisch-2.jpg` | 600 × 400 |  |
| `gewerbe/emser-therme/emser-therme-gang.jpg` | 600 × 400 |  |
| `gewerbe/emser-therme/emser-therme-relaxbereich.jpg` | 400 × 600 |  |
| `gewerbe/emser-therme/emser-therme-sitzecke.jpg` | 400 × 600 |  |
| `gewerbe/ladenbau/ladenbau-koblenz.jpg` | 600 × 400 |  |
| `hero/creative-wohntraeume.webp` | 600 × 400 |  |
| `privat/bad/bad-03.jpg` | 400 × 600 |  |
| `privat/bad/bad-04.jpg` | 400 × 600 |  |
| `privat/kueche/kueche-1.jpg` | 600 × 400 |  |
| `privat/kueche/kueche.jpg` | 600 × 400 |  |
| `privat/kueche/kuechenschraenke-1.jpg` | 400 × 600 |  |
| `privat/kueche/schrank-thermomix.jpg` | 400 × 600 |  |
| `privat/kueche/spuele-arbeitsplatte.jpg` | 400 × 600 |  |
| `privat/wohnen/schlafzimmer-bett-spiegeldetail.jpg` | 400 × 600 |  |
| `privat/wohnen/schlafzimmer-doppeltuer.jpg` | 400 × 600 |  |
| `privat/wohnen/spiegel-schrankwand-schlafzimmer.jpg` | 600 × 400 |  |
| `privat/wohnen/wohnzimmer-schrankwand.jpg` | 600 × 400 | Zwei Welten |
| `privat/wohnen/wohnzimmer-vitrine.jpg` | 400 × 600 |  |
| `team/lunnebach-team2.webp` | 600 × 400 | Prozess, Video-Poster |
| `team/team-lunnebach.jpg` | 600 × 400 | Werkstatt |
| `privat/bad/badezimmermoebel-individuell.jpg` | 600 × 420 |  |
| `privat/einbau/schrankwand.jpg` | 600 × 420 |  |
| `privat/bad/bad-01.jpg` | 450 × 600 |  |
| `privat/bad/bad-02.jpg` | 450 × 600 |  |
| `hero/objekteinrichtung.jpg` | 600 × 500 |  |
| `hero/buero-box.jpg` | 450 × 700 |  |
| `hero/moebelbau-vitrine.jpg` | 450 × 700 | Hero Startseite |
| `privat/bad/bad-sideboard.jpg` | 800 × 449 |  |
| `privat/wohnen/innenausbau-02.jpg` | 800 × 498 | Projekt-Hero |
| `hero/holzwerkstaette-lunnebach.jpg` | 696 × 588 |  |
| `privat/outdoor/garten-03.jpg` | 800 × 513 |  |
| `privat/outdoor/garten-01.jpg` | 800 × 514 |  |
| `privat/outdoor/garten-04.jpg` | 800 × 518 |  |
| `gewerbe/buero/buero-mit-boden.jpg` | 800 × 533 |  |
| `gewerbe/buero/buero-mit-tisch.jpg` | 800 × 533 |  |
| `gewerbe/buero/bueroanlage-innensicht.jpg` | 800 × 533 |  |
| `gewerbe/buero/oberflaeche.jpg` | 800 × 533 |  |
| `gewerbe/buero/schrank-und-sideboard.jpg` | 800 × 533 |  |
| `gewerbe/emser-therme/emser-therme-aussenansicht.jpg` | 800 × 533 |  |
| `gewerbe/emser-therme/emser-therme-innenansicht.jpg` | 800 × 533 |  |
| `gewerbe/ladenbau/ladenbau-delikatessen.jpg` | 800 × 533 |  |
| `privat/kueche/herdfeld.jpg` | 800 × 533 |  |
| `privat/wohnen/wohnzimmer-vitrine-detail.jpg` | 800 × 533 |  |
| `gewerbe/emser-therme/emser-therme-aussenduschen.jpg` | 800 × 534 |  |
| `privat/wohnen/bibliothek-02.jpg` | 800 × 538 |  |
| `privat/kueche/kueche-nussbaum.jpg` | 799 × 600 | Projekt-Hero, Prozess |
| `gewerbe/emser-therme/ems-lounge.jpg` | 800 × 600 | Projekt-Hero, Zwei Welten |
| `gewerbe/friseursalon/friseursalon-1.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-2.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-3.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-4.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-5.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-6.jpg` | 800 × 600 |  |
| `gewerbe/friseursalon/friseursalon-7.jpg` | 800 × 600 | Projekt-Hero |
| `privat/outdoor/garten-02.jpg` | 800 × 600 |  |
| `privat/wohnen/schlafzimmer.jpg` | 800 × 600 |  |

</details>
