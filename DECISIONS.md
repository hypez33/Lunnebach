# DECISIONS – Gestaltungs- und Technikentscheidungen

Kurz dokumentiert, was wie umgesetzt wurde und wo bewusst vom Briefing abgewichen wird.

## Stack (installierte Versionen)

Next.js 16.4.1 (App Router, Turbopack, TypeScript strict) · React 19.3 · Tailwind CSS 4.3 · GSAP 3.15 + `@gsap/react` ·
React Aria Components 1.22 · React Hook Form 7.90 + Zod 4.6 · Playwright + `@axe-core/playwright` · sharp.

### Next.js 16 – Besonderheiten, die das Projekt prägen

- **Cache Components + Partial Prefetching** sind in `create-next-app@latest` Standard und bleiben aktiv. Alle Seiten
  sind statisch vorgerendert (`○`), Projektdetails per `generateStaticParams`.
- **`<PageMotion>` umschließt jede Seite** statt im Layout zu sitzen: Das Seitensegment hydriert getrennt vom Layout
  (sonst Hydration-Mismatch, weil SplitText das DOM vorher verändert), und Next hält besuchte Seiten versteckt im DOM
  (`<Activity>`) – der Scope verhindert Animationen an fremden, versteckten Seiten.
- **Projektdetail ohne `<Suspense>`** (`export const instant = false`): Mit Suspense lag der vorgerenderte Inhalt in
  einem versteckten Streaming-Segment – ohne JavaScript wäre die Seite leer gewesen. Projektlinks nutzen
  `prefetch={true}`, die Navigation ist dadurch trotzdem sofort (und das View-Transition-Morphing greift).
- **`src/proxy.ts`** (Nachfolger von Middleware) beantwortet unbekannte Projekt-Slugs mit echtem HTTP 404; mit
  Cache Components stünde der Status sonst durch die vorab gestreamte App Shell schon auf 200.
- `next/image`: `priority` ist in Next 16 durch **`preload`** ersetzt; `images.qualities` ist Pflicht (`[75, 85]`).
- `data-scroll-behavior="smooth"` am `<html>`, damit Next beim Routenwechsel weich-scrollen kurz aussetzt.
- Redirects mit `statusCode: 301` (nicht `permanent`, das wäre 308). Varianten mit `/` am Ende normalisiert Next selbst.

## Assets

- `scripts/fetch-assets.mjs` lädt alle 100 Dateien (100/100 erfolgreich, Platzhalter-Logik für Fehlschläge vorhanden),
  `scripts/build-image-manifest.mjs` erzeugt `src/content/images.ts` (Maße, Alt-Text, Original-URL, Kategorie,
  Blur-Placeholder als 12-px-PNG in Base64).
- **Kein Bild erreicht 1 600 px.** Daraus folgt die Bildregel: Bilder werden nie breiter als nativ dargestellt
  (`Figure` setzt `max-width` = native Breite), große Flächen werden über **gerahmte Kompositionen** (Hero als Werkzeichnung
  mit Schriftfeld und Detailausschnitt, „Zwei Welten“ mit 4 %-Rahmen), **Split-Layouts** (Projekt-Hero, Leistungsbereiche)
  und eine **Grain-Ebene** (SVG-Noise, 4,5 %) gelöst. Liste der zu ersetzenden Bilder in `TODO-CONTENT.md`.
- Banner-Streifen der alten Seite (700 × 85, 600 × 200) sind im Manifest, werden aber nicht als Inhaltsbilder genutzt.
- Logo: nur PNG – zwei Varianten (dunkel auf hell, hell auf dunkel) liegen übereinander und werden per CSS je nach
  Sektion umgeschaltet (kein CSS-Filter, damit das Orange exakt bleibt). `unoptimized`, da winzige PNGs.

## Farbe & Kontrast

- **Akzentfarbe aus dem Logo: `#E46929`** (sharp: gesättigte, deckende Pixel mit R > G > B, häufigster 5-bit-Bucket gemittelt;
  261 Pixel). Fallback `#E5731E` wäre nur bei Fehlschlag gegriffen.
- `--color-accent-text: #A34B1C` – Akzent so weit Richtung Dunkelbraun gemischt, bis ≥ 4,5:1 auch auf `paper-2`.
- **Akzent auf Paper erreicht nur 2,93:1** → wird auf hellem Grund ausschließlich dekorativ genutzt (Anrisslinie,
  Maßketten, Flächen). **Fokusrahmen auf hellem Grund = `accent-text`** (5,21:1), auf dunklem Grund = `accent` (5,29:1),
  gesteuert über `--focus-color` und `[data-theme="dark"]`.
- Primär-Button: Ink auf Accent (5,29:1). Text auf Accent in Paper wäre zu schwach und wird nicht verwendet.
- Zusätzliche Tokens: `ink-2`, `paper-muted` (#B9B0A4, 8,17:1 auf Ink), `line-strong`, `line-dark`, `error` (#A3261C).

Prüfskript: `npm run contrast` (`scripts/contrast.mjs`).

| Kombination | Vordergrund | Hintergrund | Kontrast | Ziel | OK |
|---|---|---|---|---|---|
| ink auf paper | `#1C1916` | `#F4F1EC` | 15.53:1 | ≥ 4.5:1 | ✓ |
| ink auf paper-2 | `#1C1916` | `#EAE5DD` | 13.96:1 | ≥ 4.5:1 | ✓ |
| ink-muted auf paper | `#5C554D` | `#F4F1EC` | 6.51:1 | ≥ 4.5:1 | ✓ |
| ink-muted auf paper-2 | `#5C554D` | `#EAE5DD` | 5.85:1 | ≥ 4.5:1 | ✓ |
| accent-text auf paper | `#A34B1C` | `#F4F1EC` | 5.21:1 | ≥ 4.5:1 | ✓ |
| accent-text auf paper-2 | `#A34B1C` | `#EAE5DD` | 4.68:1 | ≥ 4.5:1 | ✓ |
| ink auf accent (Primär-Button) | `#1C1916` | `#E46929` | 5.29:1 | ≥ 4.5:1 | ✓ |
| accent auf paper – nur dekorativ (Anriss, Maßketten) | `#E46929` | `#F4F1EC` | 2.93:1 | ≥ 1:1 | ✓ |
| Fokusrahmen hell: accent-text auf paper | `#A34B1C` | `#F4F1EC` | 5.21:1 | ≥ 3:1 | ✓ |
| Fokusrahmen/Links dunkel: accent auf ink | `#E46929` | `#1C1916` | 5.29:1 | ≥ 4.5:1 | ✓ |
| paper auf ink | `#F4F1EC` | `#1C1916` | 15.53:1 | ≥ 4.5:1 | ✓ |
| paper-muted auf ink | `#B9B0A4` | `#1C1916` | 8.17:1 | ≥ 4.5:1 | ✓ |
| walnut auf paper (nur Fläche) | `#8A6A4A` | `#F4F1EC` | 4.40:1 | ≥ 3:1 | ✓ |
| line (14 % ink) auf paper – dekorativ | `#D6D3CE` | `#F4F1EC` | 1.32:1 | ≥ 1:1 | ✓ |
| Formular-Rahmen (ink-muted) auf paper | `#5C554D` | `#F4F1EC` | 6.51:1 | ≥ 3:1 | ✓ |
| error auf paper (Fehlermeldungen) | `#A3261C` | `#F4F1EC` | 6.54:1 | ≥ 4.5:1 | ✓ |
| error auf paper-2 (Fehlermeldungen) | `#A3261C` | `#EAE5DD` | 5.87:1 | ≥ 4.5:1 | ✓ |
| Fokusrahmen accent-text auf paper-2 | `#A34B1C` | `#EAE5DD` | 4.68:1 | ≥ 3:1 | ✓ |

## Typografie

- Fraunces (variabel, Achsen `opsz` + `SOFT`; `WONK` entfernt, da ungenutzt – spart Dateigröße), Instrument Sans
  (variabel, ohne `wdth`), IBM Plex Mono 400/500 – alle über `next/font/google`, beim Build selbst gehostet.
- Display-H1: `clamp(2.75rem, 1.5rem + 5.6vw, 7.25rem)` → 44 px mobil, ~105 px bei 1440, max. 116 px. Gegenüber dem
  ersten Entwurf (bis 120 px) leicht reduziert, damit bei 1440 × 900 Subline und CTAs über dem Falz bleiben.
  Auf Desktop fester Umbruch nach „Möbel,“.
- Fließtext 17 px (18 px ab 1440), Zeilenhöhe 1.6, max. 68ch. Lange Komposita: `overflow-wrap` überall,
  `hyphens: auto` unter 640 px (Reflow 320 px ohne horizontales Scrollen).

## Motion

- Infrastruktur in `src/lib/motion/`: `gsap.ts` (zentrale Registrierung), `eases.ts` (`lunnebach` = `0.65, 0, 0.35, 1`,
  `expo.out`, Dauern), `preference.ts` (Schalter + `prefers-reduced-motion`), `useMotion.ts` (`useGSAP` + `gsap.matchMedia`
  mit `reduceMotion` / `isDesktop`, Neuaufbau beim Umschalten).
- **Plugins werden nach der Hydration nachgeladen** (`loadMotion()`), Kern und `useGSAP` statisch. Registrierung bleibt
  zentral und einmalig. Grund: Lighthouse-Performance mobil (siehe unten).
- **Progressive Enhancement:** Inline-Script im `<head>` setzt `.js`, übernimmt den gespeicherten Schalter und setzt nach
  3 s einen **Failsafe** (`.motion-failsafe`), falls Motion-Code nicht startet. Startzustände per CSS gibt es nur für den
  Hero (Desktop); alle anderen Reveals setzen ihren Startzustand erst in JS und **überspringen Elemente, die beim Start
  schon sichtbar sind** (kein Aufblitzen).
- Deklarativ: Server Components markieren Elemente mit `data-split`, `data-clip`, `data-dimension`, `data-count`;
  `<PageMotion>` verdrahtet sie.
- **Moment 1 Hero:** wie spezifiziert (DrawSVG-Linie, Schiebetür-clip, SplitText-Zeilen, Maßkette), < 1,8 s.
  **Abweichung mobil:** nur Linie + Maßkette animieren; Headline und Bild sind sofort sichtbar, damit sie nicht als
  versteckter LCP-Kandidat auf JS warten.
- **Moment 2 Maßketten:** Maßlinie in gestrecktem SVG (`preserveAspectRatio="none"`), Endstriche als eigene SVGs –
  so bleibt die Strichstärke exakt und DrawSVG funktioniert ohne Neuberechnung bei Resize.
- **Moment 3 Prozess:** gepinnte Horizontal-Strecke nur Desktop + volle Bewegung (Klasse `process--horizontal` per JS),
  `scrub: 1`, Lineal mit Millimeter-Ticks (CSS-Raster statt 200 SVG-Linien), Zähler `01 / 05`, Bilder von Skizze
  (Graustufen + Linien-Overlay) zu Farbe über eine CSS-Variable `--c` je Schritt. Keine fokussierbaren Elemente in der Strecke.
- **Moment 4 Projekte:** Filter als React-Aria-`ToggleButtonGroup`, Umsortieren mit GSAP Flip, Ergebnis per
  `role="status"` angesagt. **View Transitions** über React 19.3 `<ViewTransition name share="morph">` an Karte und
  Detail-Hero (Next 16 aktiviert das ohne Konfiguration); bei reduzierter Bewegung abgeschaltet.
- **Moment 5 Text-Reveals:** SplitText `lines` mit Maske, 0,7 s. `aria` nur bei Überschriften (`aria-label` auf `<p>`
  wäre unzulässig) – Zitate bleiben normal lesbar.
- „Zwei Welten“ (flex-grow + clip-path) und Hover-Effekte sind **reines CSS** – kein JS nötig, reduziert automatisch.
- Header: blendet beim Runterscrollen aus, nie solange der Fokus darin liegt; `scroll-padding-top` verhindert verdeckten Fokus.

## Seiten & Inhalte

- Startseite in der spezifizierten Reihenfolge (Hero → Intro → Zwei Welten → Projekte → Prozess → Werkstatt → Haltung →
  Karriere → Cabinet → Anfrage/Anfahrt), Sektionen im Stil technischer Zeichnungen durchnummeriert.
- **8 Projekte** (6 geforderte + Bibliothek/Wohnwand + Terrasse). 4 davon auf der Startseite (2 Privat, 2 Gewerbe),
  ausgewählt nach Bildqualität.
- Praxis & Apotheke: keine passenden Bilder vorhanden → Showroom-/Empfangsmotive als Platzhalter (TODO).
- Werkstatt-Maschinen: Holzton-Platzhalterflächen mit Maserung und „Foto folgt“.
- Karriere: Stellen als **native `<details>`** – aufklappbar, tastaturbedienbar und **ohne JavaScript lesbar**.
- Video: lokales Vorschaubild, YouTube (`youtube-nocookie.com`) erst nach Klick. Karte: gezeichneter „Lageplan“,
  OpenStreetMap erst nach Klick. Dadurch kein Cookie-Banner nötig.

## Formulare

- Geführte Anfrage: ein Formular, 4 Schritte, Schrittvalidierung per `trigger()`, Fokus auf Schrittüberschrift,
  Fehler inline (React-Aria `FieldError`, verknüpft per `aria-describedby`) **plus** Zusammenfassung in `aria-live`.
  Werte bleiben beim Zurückgehen erhalten. Honeypot `website`.
- Erfolgsseite `/anfrage/danke` (noindex): Vorname kommt per `sessionStorage` (try/catch); ohne Speicher erscheint eine
  neutrale Bestätigung.
- Datenschutz: **Hinweistext statt Pflicht-Checkbox** (Verarbeitung zur Vertragsanbahnung, Art. 6 Abs. 1 lit. b DSGVO) –
  weniger Hürde; vor Livegang rechtlich bestätigen.
- Bewerbung: ohne Geburtsdatum und ohne Schulabschluss-Pflichtfeld. Das Formular wird **nach der Hydration geladen**
  (es steht weit unten und zieht Select/RHF/Zod nach); ohne JS bleibt der Hinweis „per Post oder Mail“ sichtbar.
- React Aria für Dialoge (Menü, Lightbox), RadioGroup, CheckboxGroup, ToggleButtonGroup, Select, TextField.
  **Abweichung:** Der Schalter „Bewegung reduzieren“ ist ein natives `<button role="switch">` (identische Semantik,
  hält React Aria aus dem kritischen Pfad jeder Seite). Der Menü-Dialog wird erst beim ersten Öffnen geladen.

## SEO

- `metadata`/`generateMetadata` je Seite mit Canonical, OG-Bilder per `opengraph-image.tsx` (Layout „Werkzeichnung“,
  Fraunces/Plex Mono als TTF in `assets/fonts/`, OFL). Die OG-Routen sind dynamisch (`ƒ`): Mit Cache Components zählt
  Datei-I/O als Laufzeitdaten – für eine Demo unkritisch, im Betrieb per CDN cachebar.
- `sitemap.ts`, `robots.ts` (Danke-Seite ausgeschlossen), JSON-LD `HomeAndConstructionBusiness` + `LocalBusiness` im Layout.

## Qualität – Messwerte

- **Playwright: 173 Tests grün** (Desktop 1440 + Mobil 375): axe ohne serious/critical-Verstöße auf allen 19 Routen
  (mit und ohne reduzierte Bewegung, nach vollständigem Durchscrollen), genau eine H1, Landmarks, kein horizontales
  Scrollen bei 320 px, Inhalte ohne JavaScript sichtbar, Skip-Link, sichtbarer Fokus, Fokusfalle/-rückgabe in Menü und
  Lightbox, Pfeiltasten in der Lightbox, Filter per Tastatur, komplette Projektanfrage per Tastatur, Motion-Schalter
  persistent, Pin-Strecke nur mit voller Bewegung, 404 für unbekannte Projekte, alle 301-Weiterleitungen.
- **Lighthouse mobil** (lokal, simuliertes Throttling, Werte schwanken auf dieser Maschine um ±5):

| Seite | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 89–90 | 100 | 100 | 100 |
| `/privat` | 87–89 | 100 | 100 | 100 |
| `/projekte` | 86 | 100 | 100 | 100 |
| `/projekte/emser-therme` | 85 | 100 | 100 | 100 |
| `/anfrage` | 85 | 100 | 100 | 100 |
| `/karriere` | 82–86 | 100 | 100 | 100 |

  CLS überall 0. Die beobachtete LCP liegt lokal bei ~0,2 s; der simulierte Wert (3,2–4,1 s) entsteht, weil Lighthouse
  alle früh angeforderten JS-Chunks (React/Next-Runtime) samt 4-facher CPU-Drosselung in den Pfad der Text-LCP rechnet.
  **Ziel ≥ 90 ist damit nur auf der Startseite erreicht** – nächste Hebel siehe README („Nächste Schritte“).
