# Prompt für Claude (VS Code) – Lunnebach.com Showcase-Demo

> Alles ab der nächsten Linie in einen leeren Projektordner kopieren und Claude in VS Code geben.

---

## Deine Rolle und das Ziel

Du bist Senior Creative Developer und baust eine **Showcase-Demo** für den Relaunch von **lunnebach.com**, der Website einer Tischlerei in Koblenz. Die Demo ist ein Proof of Concept für den Kunden – sie muss sich anfühlen wie eine fertige Premium-Website, nicht wie ein Template. Ziel: Der Kunde sieht die Seite und sagt „Genau so.“

Maßstab: Awwwards-Niveau in Gestaltung und Motion, gleichzeitig barrierefrei nach WCAG 2.2 AA, schnell und vollständig responsive. Inhalte sind teilweise Platzhalter, Design und Interaktion sind final gedacht.

Arbeite selbstständig. Triff sinnvolle Entscheidungen, statt nachzufragen, und dokumentiere sie kurz in `DECISIONS.md`.

---

## 1. Kontext: Wer ist Lunnebach?

- Tischlerei in Koblenz, Inhaber Tischlermeister **Rolf Lunnebach**, seit fast 30 Jahren, rund 10 Mitarbeitende.
- Eigenbezeichnung: **„Die creative Holzwerkstätte“** (das „C“ ist Markenzeichen – im Claim und Markennamen beibehalten, im Fließtext normal „kreativ“ schreiben).
- Zwei Geschäftsfelder:
  - **Privat („Wohnräume“):** Tischlerküchen, Wohn- und Schlafzimmermöbel, Einbaumöbel und Stauraum, Badezimmermöbel, Outdoor (Garten, Balkon, Terrasse).
  - **Gewerbe („Objekteinrichtung“):** Ladenbau, Praxis- und Apothekeneinrichtung, Büroeinrichtung, Hotels, Gastronomie, Freizeitanlagen (z. B. Emser Therme).
- Stärken: Planung bis Montage aus einer Hand, CNC-Fertigung plus Handarbeit im Bankraum, eigenes Montageteam, Gewerke-Koordination.
- Schwestermarke **Cabinet**: Einbauschränke und Schiebetüren nach Maß, Ausstellung in Koblenz → https://www.cabinet-koblenz.de/
- Auszeichnung: Siegel „Top-Arbeitgeber im Handwerk“.
- Kontakt: Alemannenstraße 21, 56072 Koblenz · Telefon 0261 61963 · rolf@lunnebach.com
- Video: YouTube-ID `RBPyLdsKxfs`

**Zielgruppen:** private Bauherren mit gehobenem Anspruch · Gewerbekunden (Praxen, Apotheken, Läden, Gastro, Hotels) · Bewerber (Tischler, Meister, Azubis) · Architekten/Planer.

**Ansprache:** Kunden werden gesiezt, auf der Karriereseite wird geduzt.

---

## 2. Tech-Stack (verbindlich)

- **Next.js, aktuellste stabile Version** (`npx create-next-app@latest`, App Router, TypeScript strict, Turbopack, `src/`-Ordner, ESLint). Server Components als Standard, Client Components nur wo nötig.
- **Tailwind CSS v4** mit Design-Tokens als CSS-Variablen in `@theme`.
- **GSAP 3** inkl. Plugins (alle kostenlos, auch kommerziell): `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, `Flip`, `CustomEase`. Einbindung über `@gsap/react` (`useGSAP`), Plugins einmal zentral registrieren.
- **React Aria Components** für barrierefreie Interaktionen (Dialog/Lightbox, Menü, Formularfelder, RadioGroup, Tabs/Filter).
- **next/font/google** für Fraunces, Instrument Sans, IBM Plex Mono (wird beim Build selbst gehostet, kein Abruf bei Google zur Laufzeit).
- **Formulare:** React Hook Form + Zod, Absenden über eine Server Action, die in der Demo nur validiert, loggt und eine Erfolgsmeldung zurückgibt.
- **Kein CMS in der Demo.** Alle Inhalte liegen typisiert in `src/content/*.ts` – so strukturiert, dass sie später 1:1 durch Payload CMS ersetzt werden können (Collections: `projects`, `services`, `jobs`, `team`, `pages`).
- **Keine Smooth-Scroll-Library** (kein Lenis, kein Locomotive). Natives Scrollen.
- **Kein Cookie-Banner nötig:** keine Tracker, keine externen Einbindungen ohne Klick (YouTube erst nach Klick über `youtube-nocookie.com`, Karte erst nach Klick).
- Paketmanager: npm. `git init` am Anfang, nach jeder Phase ein Commit.

---

## 3. Assets von der alten Website übernehmen

Schreibe `scripts/fetch-assets.mjs`, das alle unten gelisteten Dateien nach `public/images/<ordner>/` herunterlädt (Dateinamen sprechend vereinfachen, z. B. `csm_kueche_nussbaum_b774ac0a03-30-800-600-80.jpg` → `kueche-nussbaum.jpg`). Führe es aus.

Danach:
1. Lies mit `sharp` die Maße jeder Datei aus und erzeuge `src/content/images.ts` mit `{ src, width, height, alt, originalUrl, category }`.
2. Schreib für jedes Bild einen beschreibenden deutschen Alt-Text aus dem Kontext (Dateiname, Kategorie) und markiere ihn mit `altReviewed: false`.
3. Erzeuge pro Bild einen Blur-Placeholder (`plaiceholder` oder `sharp` → base64).
4. **Die meisten Projektbilder sind nur 800 × 600 px.** Nutze sie nie größer als ihre native Breite ohne Gestaltungstrick. Für große Flächen: gerahmte Komposition, Duotone/Grain-Overlay oder Split-Layouts. Bilder mit ≥ 1600 px Breite bevorzugt für Hero und Vollflächen. Kennzeichne in `TODO-CONTENT.md`, welche Bilder hochaufgelöst ersetzt werden müssen.
5. Schlägt ein Download fehl: Platzhalter in Holzton-Fläche mit dezenter Maserungstextur (CSS/SVG) erzeugen, im Log vermerken, weiterarbeiten.

Basis-URL: `https://www.lunnebach.com/wp-content/uploads/`

```
# brand/
2020/09/logo-weiss-orange.png          # Logo hell auf dunkel
2021/02/logo-2.png                      # Logo-Variante
2021/01/rolf_lunnebach_weiss.png        # Signet Rolf Lunnebach
2023/11/siegel.png                      # Top-Arbeitgeber-Siegel

# hero/ (Großbilder)
2023/11/moebelbau-vitrine.jpg
2023/11/buero-box.jpg
2023/11/holzwerkstaette-lunnebach.jpg
2023/11/creative-wohntraeume.webp
2023/11/objekteinrichtung.jpg

# team/
2023/11/team-lunnebach.jpg
2023/11/lunnebach-team2.webp
2023/11/team1.jpg
2023/11/team2.jpg
2023/11/team3.jpg
2023/11/team4.jpg
2023/11/team5.jpg
2023/11/team9.jpg

# privat/ (Kategorie-Bilder)
2023/11/kuechenmoebel.jpg
2023/11/spec-cont-moebel.jpg
2023/11/spec-cont-einbau.jpg
2023/11/spec-cont-bad.jpg
2023/11/spec-cont-garten.jpg
2023/11/acc_kueche.jpg
2023/11/cc_moebel.jpg
2023/11/acc_einbauschrank.jpg
2023/11/cc_bad.jpg
2023/11/acc_outdoor-1.jpg

# privat/kueche/
2023/11/csm_kueche_8ce856ecb0.jpg
2023/11/csm_herdfeld_e9529026d2-26-800-600-80.jpg
2023/11/csm_kueche_8ce856ecb0-1.jpg
2023/11/csm_kueche_nussbaum_b774ac0a03-30-800-600-80.jpg
2023/11/csm_kuechenschraenke_fb4fc66cad__1_-28-800-600-80.jpg
2023/11/csm_schrank_thermomix_5c676fb423-31-800-600-80.jpg
2023/11/csm_spuele_arbeitsplatte_f62d9f9a03-32-800-600-80.jpg

# privat/wohnen/
2023/11/csm_wohnzimmer-vitrine-detail_ebd6d58a39.jpg
2023/11/csm_bibliothek_02_8bdd396cae-40-800-600-80.jpg
2023/11/csm_innenausbau_02_d822880475-41-800-600-80.jpg
2023/11/csm_schlafzimmer_bett_spiegeldetail_3cd6bc581a-42-800-600-80.jpg
2023/11/csm_schlafzimmer_doppeltuer_09dc65915c-43-800-600-80.jpg
2023/11/csm_schlafzimmer_f84fce109c-47-800-600-80.jpg
2023/11/csm_spiegel_schrankwand_schlafzimmer_1d62718083-44-800-600-80.jpg
2023/11/csm_wohnzimmer_schrankwand_8a92bda63d-45-800-600-80.jpg
2023/11/csm_wohnzimmer_vitrine_b0e7e303e5-46-800-600-80.jpg

# privat/einbau/
2023/11/csm_schrankwand_5d84acd440.jpg
2023/11/csm_raumtrenner_d6e0376abb-56-800-600-80.jpg
2023/11/csm_schrank_schraege_8c14911831-57-800-600-80.jpg
2023/11/csm_schrankwand_hoch_9e4c0533b2-58-800-600-80.jpg

# privat/bad/
2023/11/badezimmermoebel-individuell.jpg
2023/11/csm_bad_01_9988181d17-64-800-600-80.jpg
2023/11/csm_bad_02_cec6baac9c-65-800-600-80.jpg
2023/11/csm_bad_03_8df120437a-66-800-600-80.jpg
2023/11/csm_bad_04_f7042a4976-67-800-600-80.jpg
2023/11/csm_bad_sideboard_1deb1e84d1-68-800-600-80.jpg
2023/11/csm_bad_waschbecken_39c2e605e8-69-800-600-80.jpg

# privat/outdoor/
2023/11/csm_garten-terrassenbau_292ee7ea02.jpg
2023/11/csm_garten_01_f941805190-76-800-600-80.jpg
2023/11/csm_garten_02_ac1fe404b0-77-800-600-80.jpg
2023/11/csm_garten_03_0d3d1ec486-78-800-600-80.jpg
2023/11/csm_garten_04_a9d0be5687-79-800-600-80.jpg

# gewerbe/ (Kategorie-Bilder)
2023/11/ladenbau-individuell.jpg
2023/11/praxiseinrichtung_individuell.jpg
2023/11/bueroeinrichtung-individuell.jpg
2023/11/freizeit-spec.jpg
2023/11/acc_obj.jpg
2023/11/acc_buero.jpg
2023/11/acc_prax.jpg
2023/11/acc-freizeitanlagen.jpg

# gewerbe/ladenbau/
2023/11/csm_counter_e68c8acb35-108-800-600-80.jpg
2023/11/csm_display_close_285b0c9933-109-800-600-80.jpg
2023/11/csm_ladenbau_delikatessen_fc02bbe1e5-110-800-600-80.jpg
2023/11/csm_ladenbau_friseur_counter_b6b0ef35bf-112-800-600-80.jpg
2023/11/csm_ladenbau_friseur_d47ef0ee0f-111-800-600-80.jpg
2023/11/csm_ladenbau_tee_c672eab1ff-113-800-600-80.jpg
2023/11/csm_wanddisplay_0f329eda1b-114-800-600-80.jpg
2023/11/ladenbau_koblenz-115-800-600-80.jpg

# gewerbe/friseursalon/
2023/11/maerten1-149-800-600-80.jpg
2023/11/maerten2-150-800-600-80.jpg
2023/11/maerten3-151-800-600-80.jpg
2023/11/maerten4-152-800-600-80.jpg
2023/11/maerten5-153-800-600-80.jpg
2023/11/maerten6-154-800-600-80.jpg
2023/11/maerten7-155-800-600-80.jpg

# gewerbe/buero/
2023/11/csm_buero_mit_boden_ca03d9e954-95-800-600-80.jpg
2023/11/csm_buero_mit_tisch_b6ad0cb05b-88-800-600-80.jpg
2023/11/csm_buero_totale_bb399ac3a2-89-800-600-80.jpg
2023/11/csm_bueroanlage_ecke_5e3de20f91-84-800-600-80.jpg
2023/11/csm_bueroanlage_gesamtansicht_4f0dfb02b3-85-800-600-80.jpg
2023/11/csm_bueroanlage_innensicht_fc8e36abd5-86-800-600-80.jpg
2023/11/csm_bueroanlage_medienschrank_5c89c0a756-87-800-600-80.jpg
2023/11/csm_konferenztisch_1_7d14274ce7-90-800-600-80.jpg
2023/11/csm_konferenztisch_2_683a9d9071-91-800-600-80.jpg
2023/11/csm_oberflaeche_b3977e5bb1-92-800-600-80.jpg
2023/11/csm_schrank_und_sideboard_5d2991db41-93-800-600-80.jpg

# gewerbe/emser-therme/
2023/11/csm_emser_therme_aussenansicht_0fcfc39f92-124-800-600-80.jpg
2023/11/csm_emser_therme_aussenduschen_518313552c-125-800-600-80.jpg
2023/11/csm_emser_therme_gang_8a5ec6b106-126-800-600-80.jpg
2023/11/csm_emser_therme_innenansicht_560b3b4c8a-127-800-600-80.jpg
2023/11/csm_emser_therme_relaxbereich_c588df1e33-128-800-600-80.jpg
2023/11/csm_emser_therme_sitzecke_a0b36d1cc9-129-800-600-80.jpg
2023/11/ems_lounge-136-800-600-80.jpg
```

**Logo:** Nur PNG vorhanden. Binde es über `next/image` ein, sorge für korrekte Darstellung auf hellem und dunklem Grund (ggf. CSS-Filter oder zwei Varianten). Lege `TODO-CONTENT.md`-Eintrag „Logo als SVG anfordern“ an. **Lies die Akzentfarbe aus dem Logo aus** (dominanter Orangeton per `sharp`-Pixelanalyse) und setze sie als `--color-accent`. Fallback, falls das scheitert: `#E5731E`.

---

## 4. Designkonzept: „Auf den Millimeter“

Die Seite wirkt wie eine Werkzeichnung, die beim Scrollen zum fertigen Möbel wird. Gestaltungselemente sind **Anrisslinien, Maßketten, Fugen und Raster** – ruhig, präzise, viel Weißraum, große Bilder. Edel durch Reduktion, nicht durch Effekte. Keine Verläufe, keine Glassmorphism-Spielereien, keine Schatten außer minimalen Elevation-Schatten bei Overlays.

### Typografie
| Rolle | Schrift | Einsatz |
|---|---|---|
| Display/Headlines | **Fraunces** (variabel, `opsz` nutzen, leicht weiches `SOFT`) | H1–H3, große Zitate |
| Text/UI | **Instrument Sans** | Fließtext ab 17 px (`1.0625rem`), UI, Buttons |
| Technisch | **IBM Plex Mono** | Maßketten, Eyebrows, Nummerierungen, Metadaten |

- Fluide Typo-Skala mit `clamp()`; H1 auf Desktop ca. 88–120 px, mobil ca. 44 px.
- Zeilenlänge Fließtext max. 68ch, Zeilenhöhe 1.6, Headlines eng (1.0–1.1), leicht negatives Tracking.
- Eyebrows in Mono, Versalien, `letter-spacing: 0.12em`, 12–13 px.

### Farben (als Tokens)
| Token | Wert | Einsatz |
|---|---|---|
| `--color-paper` | `#F4F1EC` | Grundfläche hell (Kalkweiß) |
| `--color-paper-2` | `#EAE5DD` | Flächen, Karten |
| `--color-ink` | `#1C1916` | Text, dunkle Sektionen (Räuchereiche) |
| `--color-ink-muted` | `#5C554D` | Sekundärtext (muss ≥ 4,5:1 auf paper erreichen – prüfen!) |
| `--color-accent` | aus Logo | Anrisslinie, Fokusrahmen, CTA-Flächen, Maßketten |
| `--color-accent-text` | Accent so weit abgedunkelt, dass ≥ 4,5:1 auf paper | Textlinks |
| `--color-walnut` | `#8A6A4A` | nur Flächen/Details, nie Text |
| `--color-line` | `rgba(28,25,22,0.14)` | Raster, Trennlinien |

Dunkle Sektionen (Werkstatt, Karriere-Teaser, Footer) invertieren auf `ink`-Grund mit `paper`-Text. Kontraste aller Kombinationen in `DECISIONS.md` dokumentieren.

### Raster und Details
- 12-Spalten-Raster, große Außenabstände (Desktop `clamp(24px, 5vw, 96px)`).
- Ein feines, optional einblendbares Hintergrundraster (1px `--color-line`) als Werkzeichnungs-Anmutung in Hero und Prozess.
- Nummerierungen im Stil technischer Zeichnungen: `01 —`, `Pos. 03`, `M 1:20`.
- Buttons: rechteckig mit 2px Radius, Primär = Accent-Fläche mit Ink-Text (Kontrast prüfen!), Sekundär = Outline. Hover: Linie läuft unter dem Label durch (wie Anriss). Keine Bild-Buttons.
- Cursor bleibt nativ. Keine Custom-Cursor.

### Bildbehandlung
- Bilder mit `clip-path`-Reveals, nie Fade-in von 0.
- Sehr dezenter Grain-Layer (SVG-Noise, 3–4 % Opazität) über großen Bildern, um niedrige Auflösung zu kaschieren.
- Galerie: asymmetrisches Masonry-/Editorial-Raster, keine gleichförmigen Kachelreihen.

---

## 5. Motion-System (GSAP)

Grundsatz: **Fünf Signature-Momente, die sitzen – nicht Bewegung überall.** Animation erzählt Handwerk: messen, anreißen, fügen.

Infrastruktur:
- `src/lib/motion/` mit zentraler Plugin-Registrierung, Eases (`CustomEase.create("lunnebach", "0.65, 0, 0.35, 1")`, plus `expo.out` für Reveals) und Dauern als Konstanten.
- Alles läuft in `gsap.matchMedia()` mit Bedingungen `reduceMotion: "(prefers-reduced-motion: reduce)"` und `isDesktop: "(min-width: 1024px)"`.
- Zusätzlicher **Schalter „Bewegung reduzieren“** im Footer (und im Mobile-Menü), speichert in `localStorage` (mit try/catch), setzt `data-motion="reduced"` auf `<html>`; Motion-Code respektiert beides.
- **Progressive Enhancement:** Inhalte sind serverseitig gerendert und ohne JS sichtbar. Anfangszustände nur setzen, wenn JS läuft (Klasse `.js` am `<html>` per Inline-Script im `<head>`), damit nichts unsichtbar bleibt.
- Cleanup sauber über `useGSAP`-Scope; bei Route-Wechsel `ScrollTrigger.refresh()`.

### Moment 1 – Hero „Anriss“
- Beim Laden zieht eine 1,5 px Accent-Linie von links über die Breite, wie mit dem Streichmaß (DrawSVG, ~0,9 s, `lunnebach`-Ease).
- Gleichzeitig verschiebt sich ein Bildpanel wie eine Schiebetür auf (`clip-path: inset(0 0 0 100%)` → `inset(0)`, ~1,2 s, `expo.out`) – Brücke zu Cabinet.
- Headline zeilenweise mit SplitText (`type: "lines"`, `mask: "lines"`, `yPercent: 110 → 0`, Stagger 0,08).
- An einer Bildkante erscheint eine Maßangabe in Mono (z. B. Höhe der Vitrine) – rein dekorativ.
- Gesamtdauer < 1,8 s, kein Blockieren der Interaktion. Bei reduzierter Bewegung: alles sofort sichtbar, Linie statisch.

### Moment 2 – Maßketten
- Wiederverwendbare Komponente `<Dimension>`: SVG-Bemaßung mit Endstrichen, Maßlinie und Label in IBM Plex Mono (z. B. `2 840`), horizontal oder vertikal, über Bildern positionierbar.
- ScrollTrigger (`start: "top 75%"`): Maßlinie zeichnet sich (DrawSVG), Endstriche erscheinen, Label blendet mit leichtem `y`-Versatz ein.
- `aria-hidden="true"`, da dekorativ. Werte in der Demo sind illustrativ – in `TODO-CONTENT.md` vermerken.

### Moment 3 – Prozess „Vom Strich zum Schrank“
- Die 5 Prozessschritte als gepinnte Horizontal-Strecke (nur `isDesktop` und ohne reduzierte Bewegung), `scrub: 1`.
- Unten ein Fortschrittsbalken als Zollstock/Lineal mit Millimeter-Ticks, der sich mitfüllt; aktueller Schritt in Mono (`01 / 05`).
- Jeder Schritt: große Ziffer in Fraunces, Titel, Text, Bild; das Bild wechselt von Skizzen-Anmutung (Graustufen + Linien-Overlay) zu Farbe, je weiter der Prozess fortschreitet.
- Mobil/reduziert: vertikale Abfolge mit einfachen Reveals.
- Keine Fokusfalle: Die Strecke enthält keine fokussierbaren Elemente, oder bei Fokus wird per ScrollTrigger korrekt dorthin gescrollt.

### Moment 4 – Projekte
- Projektübersicht mit Filter (Alle / Privat / Gewerbe) als React-Aria-`ToggleButtonGroup`; Umsortieren mit **GSAP Flip**.
- Karte → Detailseite mit **View Transitions** (Bild morpht in den Hero der Detailseite), sofern in der installierten Next.js-Version verfügbar; sonst sauberer Fallback.
- Hover/Fokus auf Karte: Bild skaliert minimal (1.03), Maßkette zeigt sich an der Kante, Titel-Linie läuft durch.

### Moment 5 – Text-Reveals
- Sektionsheadlines zeilenweise mit SplitText beim Eintritt, kurz und dezent (0,7 s). Fließtext wird **nicht** animiert.

### Zusätzlich (sparsam)
- „Zwei Welten“ (Privat/Gewerbe): geteilte Fläche, die fokussierte/gehoverte Hälfte wächst (`flex-grow` animiert), Bild gibt mehr frei.
- Zahlen in der Werkstatt-Sektion zählen einmalig hoch.
- Header: blendet beim Runterscrollen aus, beim Hochscrollen ein; Logo wechselt hell/dunkel je nach Sektion darunter.

---

## 6. Seiten und Struktur

```
/                      Startseite (höchste Priorität, voll ausgearbeitet)
/privat                Wohnräume: Übersicht + 5 Leistungsbereiche als Anker-Sektionen
/gewerbe               Objekteinrichtung: Übersicht + 4 Leistungsbereiche
/projekte              Projektübersicht mit Filter
/projekte/[slug]       Projektdetail (mindestens 6 Projekte, statisch generiert)
/werkstatt             Über uns: Team, Haltung, Prozess, Maschinen, Koblenz, Cabinet
/karriere              Stellen, Ausbildung, Benefits, Kurzbewerbung
/anfrage               Geführte Projektanfrage
/impressum, /datenschutz, /barrierefreiheit   Platzhalterseiten mit sauberem Layout
```

Globale Elemente:
- **Header:** Logo, Navigation (Privat, Gewerbe, Projekte, Werkstatt, Karriere), Button „Projekt anfragen“, Telefon-Icon-Link mobil. Mobile-Menü als Vollbild-Overlay mit React-Aria-Dialog, große Typo, Fokus korrekt gefangen und zurückgegeben.
- **Footer (dunkel):** Claim, Adresse, Telefon, E-Mail, Öffnungszeiten (Platzhalter), Cabinet-Link, Rechtliches, Schalter „Bewegung reduzieren“, Signet Rolf Lunnebach.
- **Skip-Link** „Zum Inhalt springen“.

### Startseite – Abfolge
1. **Hero** (Moment 1) mit Eyebrow, H1, Subline, zwei CTAs, großes Bild, Hintergrundraster.
2. **Intro-Statement:** ein großer Satz in Fraunces, darunter drei kurze Fakten in Mono.
3. **Zwei Welten:** Privat | Gewerbe.
4. **Ausgewählte Projekte:** 4 Projekte in Editorial-Layout mit Maßketten (Moment 2), Link „Alle Projekte“.
5. **Prozess** (Moment 3).
6. **Werkstatt (dunkel):** Zitat Rolf Lunnebach groß, Signet, Zahlen, Teamfoto, Video-Teaser (YouTube erst nach Klick, mit Hinweis).
7. **Haltung:** 6 Werte als Raster mit Nummerierung.
8. **Karriere-Teaser** mit Siegel.
9. **Cabinet-Teaser.**
10. **Anfrage-CTA + Anfahrt:** Kurztext, Button zur Anfrage, Telefon, Karte als Platzhalter mit „Karte laden“-Button (OpenStreetMap).

### Projektdetail – Template
Hero-Bild mit Maßkette und View-Transition-Ziel · Meta-Leiste in Mono (Kategorie, Ort, Leistungen, Jahr) · Aufgabe / Lösung / Ergebnis · Editorial-Galerie mit barrierefreier Lightbox (React-Aria-Dialog, Pfeiltasten, Escape, Bildunterschriften, Zähler) · Zitat (optional) · „Nächstes Projekt“ als großer Übergang · CTA.

### Projektanfrage – geführt in 4 Schritten
1. Privat oder Gewerbe (große Auswahlkarten, RadioGroup)
2. Projektart (abhängig von Schritt 1, Mehrfachauswahl) + kurze Beschreibung
3. Zeitraum (RadioGroup) + optional Budgetrahmen + optional Datei-Upload (Fotos/Grundriss; in der Demo nur clientseitig angezeigt)
4. Kontaktdaten + Datenschutzhinweis

Anforderungen: Fortschrittsanzeige („Schritt 2 von 4“), Zurück jederzeit möglich, Eingaben bleiben erhalten, Fehler inline im Klartext und per `aria-live` angesagt, Fokus springt beim Schrittwechsel auf die neue Schrittüberschrift, kein Zeitlimit, Spam-Schutz per Honeypot. Erfolgsseite mit persönlicher Bestätigung.

### Karriere – Kurzbewerbung
Name, E-Mail, Telefon, gewünschte Stelle (Select), ein Upload (optional), Nachricht. **Kein Geburtsdatum, kein Pflichtfeld Schulabschluss.**

---

## 7. Texte (Copy Deck)

Nutze diese Texte. Alles in `[eckigen Klammern]` ist Platzhalter und muss in `TODO-CONTENT.md` gelistet werden. Fehlende Texte schreibst du im selben Ton: konkret, ruhig, selbstbewusst, kurze Sätze, keine Floskeln wie „Ihr Partner für…“.

### Startseite

**Hero**
- Eyebrow: `TISCHLEREI · KOBLENZ · SEIT FAST 30 JAHREN`
- H1: **Räume und Möbel, auf den Millimeter gedacht.**
- Subline: Lunnebach plant und fertigt Einrichtungen nach Maß – für Ihr Zuhause, für Praxis, Laden und Hotel. Entworfen in Koblenz, gefertigt in der eigenen Werkstatt, montiert von unserem Team.
- CTA 1: Projekt anfragen · CTA 2: Projekte ansehen

**Intro-Statement**
- Groß: Trends kommen und gehen. Gute Möbel bleiben.
- Fakten: `FAST 30 JAHRE ERFAHRUNG` · `PLANUNG BIS MONTAGE AUS EINER HAND` · `CNC-PRÄZISION UND HANDARBEIT`

**Zwei Welten**
- *Für Zuhause* — Küchen, Wohn- und Schlafräume, Einbauschränke, Bäder und Outdoor. Jedes Stück ein Unikat, das in Ihren Raum passt – nicht in einen Katalog. → Wohnräume entdecken
- *Für Unternehmen* — Ladenbau, Praxis- und Apothekeneinrichtung, Büros, Hotels und Freizeitanlagen. Wir planen mit, koordinieren die Gewerke und liefern termingerecht. → Objekteinrichtung entdecken

**Ausgewählte Projekte**
- H2: Ausgewählte Arbeiten
- Intro: Jedes Projekt beginnt mit einem Gespräch und endet mit einem Raum, der funktioniert.

**Prozess**
- H2: Vom ersten Strich bis zur letzten Schraube.
1. **Zuhören** — Wir beginnen mit einem ausführlichen Gespräch, bei Ihnen vor Ort oder in unserer Ausstellung. Ihren Stil zu verstehen, ist der erste Arbeitsschritt.
2. **Planen** — Aus Skizzen werden präzise Pläne. Wir denken Anschlüsse, Details und Abläufe mit, bevor das erste Brett zugeschnitten wird.
3. **Anpassen** — Projekte leben. Ändern sich Ideen oder Anforderungen, reagieren wir gelassen – und finden oft die bessere Lösung.
4. **Fertigen** — Millimetergenau auf unserer CNC-Anlage, veredelt von Hand im Bankraum. Qualität, die auch nach Jahren noch überzeugt.
5. **Montieren** — Unser eigenes Team baut sauber, schnell und passgenau bei Ihnen ein. Danach ist der Raum fertig – nicht fast fertig.

**Werkstatt**
- Eyebrow: `DIE CREATIVE HOLZWERKSTÄTTE`
- Zitat: „Creativität heißt nicht, dem Zeitgeist zu folgen. Creativität bedeutet, seinen Kunden zu erfassen. Außergewöhnliches zu wagen. Neue Wege zu gehen. Lösungen zu finden.“ — Tischlermeister Rolf Lunnebach
- Zahlen: `~30` Jahre Erfahrung · `~10` Menschen im Team · `1` Werkstatt in Koblenz · `0,1 mm` CNC-Genauigkeit `[PLATZHALTER – Wert prüfen]`
- Text: Planer und Tischler arbeiten bei uns unter einem Dach. Wir geben uns erst zufrieden, wenn alles stimmt – bis zur letzten Fuge.

**Haltung (6 Werte)**
1. **Wir bleiben uns treu** — Wir folgen keinem Trend, sondern einem Anspruch: Möbel, die Jahrzehnte halten.
2. **Planung bis Montage** — Ein Ansprechpartner, ein Team, eine Verantwortung – vom Aufmaß bis zur Übergabe.
3. **Erfahrung** — Fast 30 Jahre Innenausbau und Objekteinrichtung. Wir sehen Probleme, bevor sie entstehen.
4. **Creativität** — Schwer in Fakten zu fassen, leicht in unseren Projekten zu sehen.
5. **Präzision** — CNC-Fertigung auf den Millimeter, Oberflächen von Hand.
6. **Höchste Ansprüche** — An unsere Arbeit, an unser Team und an jeden Zulieferer.

**Karriere-Teaser**
- H2: Arbeite da, wo Unikate entstehen.
- Text: Wir gehören zu den Top-Arbeitgebern im Handwerk. Bei uns baust du keine Serie, sondern Projekte, die es nur einmal gibt – mit moderner CNC-Technik und echter Handarbeit. → Offene Stellen

**Cabinet-Teaser**
- H2: Cabinet – Einbauschränke und Schiebetüren nach Maß.
- Text: Sehen, anfassen, ausprobieren: In unserer Cabinet-Ausstellung in Koblenz finden Sie Lösungen für jede Nische und jede Dachschräge. → Zur Cabinet-Website

**Anfrage**
- H2: Erzählen Sie uns von Ihrem Raum.
- Text: Ein paar Angaben genügen. Wir melden uns innerhalb von [zwei Werktagen] und vereinbaren ein unverbindliches Gespräch.
- Button: Projekt anfragen · oder direkt anrufen: 0261 61963

### /privat
- H1: Wohnräume, die zu Ihnen passen.
- Intro: Freuen Sie sich auf Räume, die Ihrem Stil entsprechen, auf durchdachte Planung, effiziente Fertigung und saubere Montage.
- Bereiche (je H2, 2–3 Sätze, Galerie, CTA):
  - **Küchen** — Tischlerküchen, die zu Ihrer Art zu kochen passen: vom Herdfeld bis zum Platz für den Thermomix. Nussbaum, Lack oder Furnier – jede Front gefertigt für genau diesen Raum.
  - **Wohnen & Schlafen** — Bibliotheken, Vitrinen, Schrankwände, Betten mit Spiegeldetail. Möbel, die einen Raum ordnen und ihm Charakter geben.
  - **Einbaumöbel & Stauraum** — Schränke unter der Dachschräge, Raumteiler, raumhohe Schrankwände. Wir holen Stauraum aus Ecken, die bisher leer blieben.
  - **Bad** — Waschtische, Sideboards und Schränke, die Feuchtigkeit standhalten und trotzdem nach Wohnraum aussehen.
  - **Outdoor** — Holzlösungen für Garten, Balkon und Terrasse, gebaut für Wetter und Jahreszeiten.

### /gewerbe
- H1: Räume, in denen Unternehmen wirken.
- Intro: Wir fertigen Einrichtungen für Büros, Geschäfte und Praxen – funktional, ergonomisch und stilsicher. Auch für Hotels, Bars und Freizeitanlagen entwickeln wir Lösungen, die es kein zweites Mal gibt.
- Bereiche:
  - **Ladenbau** — Theken, Regalsysteme, Wanddisplays und Schaufenster. Der eigene Laden, genau so, wie Sie ihn sich vorgestellt haben.
  - **Praxis & Apotheke** — Empfang als freundliches Gesicht, Wartezimmer mit Ruhe, Behandlungsräume, die funktionieren. Ihre Patienten fühlen sich wohl, Ihr Team arbeitet gern.
  - **Büro** — Vom Chefzimmer bis zur ganzen Etage aus einem Guss: ergonomisch, funktional und mit der Persönlichkeit Ihres Unternehmens.
  - **Hotel, Gastro & Freizeit** — Hotels, Restaurants, Bars, Thermen und Kinos. Erfahrung aus großen Objekten bis ins kleinste Detail.
- Zusatz-Block „Alles aus einer Hand“: Elektro, Maler und weitere Gewerke koordinieren wir mit – Sie haben einen Ansprechpartner.

### Projekte (Demo-Daten, mindestens diese 6)
| Slug | Titel | Kategorie | Ort | Bilder | Story |
|---|---|---|---|---|---|
| `emser-therme` | Emser Therme | Gewerbe · Freizeit | Bad Ems | `gewerbe/emser-therme/*` | Aufgabe: Neugestaltung von Innenbereichen einer Therme. Lösung: Relaxbereich, Sitznischen, Gänge und Lounge in Holz, ausgelegt für Feuchtigkeit und Dauerbetrieb. Ergebnis: [PLATZHALTER: Umfang, Jahr] |
| `friseursalon-koblenz` | Friseursalon | Gewerbe · Ladenbau | Koblenz | `gewerbe/friseursalon/*` | Aufgabe: Ein junger Friseurmeister macht sich selbstständig und sucht eine flexible, moderne Einrichtung – mit Komplettberatung. Lösung: Arbeitsplätze auf Rollen für flexibles Arbeiten, eine Mixecke für eine große Farbauswahl als handwerkliche Herausforderung, Elektro und Maler aus einer Hand koordiniert. Ergebnis: termingerecht übergeben, ein sehr zufriedener Kunde. [Kundenname nur nach Freigabe] |
| `kueche-nussbaum` | Küche in Nussbaum | Privat · Küche | [Ort] | `privat/kueche/*` | [PLATZHALTER-Story im gleichen Aufbau] |
| `buero-konferenz` | Büro mit Konferenztisch | Gewerbe · Büro | [Ort] | `gewerbe/buero/*` | [PLATZHALTER-Story] |
| `schrankwand-dachschraege` | Schrankwand unter der Schräge | Privat · Einbau | [Ort] | `privat/einbau/*` | [PLATZHALTER-Story] |
| `bad-waschtisch` | Bad mit Waschtisch und Sideboard | Privat · Bad | [Ort] | `privat/bad/*` | [PLATZHALTER-Story] |

Optional weitere aus Ladenbau (Delikatessen, Teeladen), Wohnen (Bibliothek, Schlafzimmer), Outdoor.

### /werkstatt
- H1: Fest verwurzelt in Koblenz.
- Text: Koblenz ist unsere Heimat – die Stadt, aus der wir kommen und in der wir bleiben. Seit fast drei Jahrzehnten steht der Name Lunnebach hier für Innenausbau, Ladenbau, Objekteinrichtung und Möbelbau. Mit Cabinet kamen Einbauschränke nach Maß dazu.
- Teamgalerie mit den Teamfotos, Siegel, Prozess (Kurzform), Maschinen/Werkstatt-Platzhalter, Video, Anfahrt.

### /karriere
- H1: Arbeite da, wo Unikate entstehen.
- Intro: Von der Idee über Planung und Fertigung bis zur Montage – bei uns bist du an jedem Schritt beteiligt. Wir legen hohe Maßstäbe an uns selbst, und wir bilden gern aus, denn gute Leute brauchen wir immer.
- Benefits: Familienbetrieb mit rund 10 Leuten · moderne CNC-Technik · abwechslungsreiche Projekte für Privat- und Gewerbekunden · unbefristeter Vertrag · Weiterentwicklung zum Meister oder Techniker
- Stellen (als aufklappbare Karten, Aufgaben/Profil/Angebot):
  - **Tischlermeister oder Holztechniker (m/w/d)** — Kundenkontakt, Arbeitsvorbereitung, Auftragsabwicklung, Vor- und Nachkalkulation, Betreuung der Azubis. Erfahrung im Innenausbau, CAD/CNC von Vorteil.
  - **Tischler / Schreiner Produktion (m/w/d)** — Produktion und Montage, Handarbeit im Bankraum, Oberflächen. Abgeschlossene Ausbildung, Erfahrung im Möbelbau, Führerschein Klasse B.
  - **Ausbildung Tischler/in (m/w/d)** — Drei Jahre dual, früh an echten Kundenaufträgen, Arbeit an modernen Maschinen. Am besten mit Praktikum starten.
- Bewerbung: Kurzformular, Hinweis „Lieber per Post oder Mail? Auch gern.“

---

## 8. Barrierefreiheit (WCAG 2.2 AA – nicht verhandelbar)

- Semantisches HTML, Landmarks (`header`, `nav`, `main`, `footer`), genau eine H1 pro Seite, lückenlose Überschriftenhierarchie, `lang="de"`.
- Alles per Tastatur bedienbar, sichtbarer Fokusrahmen (2–3 px Accent, mit Offset, auch auf dunklen Sektionen sichtbar), keine Fokusfallen, logische Tab-Reihenfolge.
- Kontrast Text ≥ 4,5:1, große Schrift und UI-Elemente ≥ 3:1 – für alle Token-Kombinationen geprüft.
- Zielgrößen ≥ 24 × 24 px, Hauptaktionen ≥ 44 × 44 px.
- Reflow bei 320 px Breite / 400 % Zoom ohne horizontales Scrollen; Textabstände dürfen vom Nutzer vergrößert werden, ohne dass etwas abschneidet.
- Bewegung: `prefers-reduced-motion` und eigener Schalter (siehe Motion-System); nichts blinkt, kein Autoplay mit Ton.
- Bilder: aussagekräftige Alt-Texte, dekorative Elemente `aria-hidden`/`alt=""`.
- Formulare: sichtbare Labels, Pflichtfelder gekennzeichnet (nicht nur per Farbe), `autocomplete`-Attribute, Fehler im Klartext mit Bezug zum Feld, `aria-live`-Region.
- Lightbox und Menü als zugängliche Dialoge (Fokus rein, Escape raus, Fokus zurück).
- Seite `/barrierefreiheit` mit Erklärung zur Barrierefreiheit (Platzhalter) und Feedback-Kontakt.
- Keine Overlay-/Widget-Tools.

---

## 9. Performance und SEO

- Ziel: Lighthouse Performance ≥ 90 mobil, Accessibility 100, Best Practices 100, SEO 100.
- Core Web Vitals: LCP < 2,5 s (Hero-Bild mit `priority`), CLS < 0,1 (feste Bildmaße, Font-Fallback-Metriken), INP < 200 ms.
- GSAP und Plugins nur in Client Components laden, die sie brauchen; schwere Sektionen per Dynamic Import.
- `generateMetadata` pro Seite, Open-Graph-Bilder, `sitemap.ts`, `robots.ts`.
- JSON-LD `LocalBusiness`/`HomeAndConstructionBusiness` mit Adresse und Telefon.
- `next.config` mit 301-Redirects der alten URLs: `/ueber-uns` → `/werkstatt`, `/creativer-moebelbau` → `/privat`, `/objekteinrichtung` → `/gewerbe`, `/jobs` → `/karriere`, `/kontakt-2` → `/anfrage`, `/haftungsausschluss` → `/impressum`.

---

## 10. Projektstruktur (Vorschlag)

```
src/
  app/                 Routen, layout.tsx, globals.css (Tokens in @theme)
  components/
    layout/            Header, Footer, MobileMenu, SkipLink, MotionToggle
    ui/                Button, Link, Eyebrow, Container, Grid, Dimension, Lightbox
    sections/          Hero, Intro, TwoWorlds, FeaturedProjects, Process, Workshop, Values, CareerTeaser, CabinetTeaser, InquiryCta
    forms/             InquiryWizard, ApplicationForm
  content/             site.ts, projects.ts, services.ts, jobs.ts, values.ts, process.ts, images.ts
  lib/
    motion/            gsap.ts (Registrierung), eases.ts, useReducedMotion.ts, hooks
    a11y/
scripts/fetch-assets.mjs
tests/a11y.spec.ts
DECISIONS.md
TODO-CONTENT.md
```

---

## 11. Vorgehen in Phasen

Arbeite diese Phasen der Reihe nach ab. Nach jeder Phase: `npm run lint`, `npx tsc --noEmit`, `npm run build` – Fehler sofort beheben, dann committen.

1. **Setup:** Projekt anlegen, Abhängigkeiten, Tokens, Fonts, Grundlayout, Header/Footer, Skip-Link, Motion-Infrastruktur inkl. Schalter.
2. **Assets:** Download-Skript, Bild-Manifest, Alt-Texte, Blur-Placeholder, Akzentfarbe aus Logo.
3. **Startseite** komplett inkl. aller Motion-Momente. Das ist das Herzstück – hier die meiste Sorgfalt.
4. **Projekte:** Übersicht mit Flip-Filter, Detail-Template, 6 Projekte, Lightbox, View Transitions.
5. **Privat, Gewerbe, Werkstatt, Karriere.**
6. **Projektanfrage** und Bewerbungsformular mit Server Actions.
7. **Rechtliches, SEO, Redirects.**
8. **Qualität:** Playwright + `@axe-core/playwright`-Test über alle Routen (0 Verstöße der Stufen serious/critical), Tastatur-Durchlauf der Startseite und der Anfrage selbst prüfen, reduzierte Bewegung testen, Mobile 375 px / Tablet 768 px / Desktop 1440 px / Wide 1920 px prüfen. Wenn möglich Screenshots per Playwright erstellen und selbst kritisch begutachten: Abstände, Typo-Rhythmus, Bildschnitte. Nachbessern, bis es wie eine Premium-Seite aussieht.

---

## 12. Definition of Done

- [ ] `npm run build` läuft fehlerfrei, keine TypeScript- oder ESLint-Fehler.
- [ ] Alle Routen aus Abschnitt 6 existieren und sind gestaltet – keine leeren Seiten, kein Lorem ipsum.
- [ ] Alle fünf Motion-Momente funktionieren auf Desktop, haben mobile und reduzierte Varianten.
- [ ] Ohne JavaScript ist jeder Inhalt sichtbar und lesbar.
- [ ] axe-Tests grün, Tastaturbedienung vollständig, Fokus überall sichtbar.
- [ ] Bilder von der alten Seite eingebunden, Manifest mit Alt-Texten und Original-URLs vorhanden.
- [ ] `TODO-CONTENT.md` listet alle Platzhalter, fehlende Freigaben und Bilder, die hochaufgelöst ersetzt werden müssen.
- [ ] `DECISIONS.md` dokumentiert Abweichungen und Gestaltungsentscheidungen.
- [ ] Kurze `README.md`: Start, Skripte, Struktur, wie später Payload CMS angeschlossen wird.

Zum Schluss: Gib mir eine kurze Zusammenfassung, was gebaut wurde, was noch Platzhalter ist und welche drei Dinge du als Nächstes verbessern würdest.
