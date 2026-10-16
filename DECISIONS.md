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

---

## Mobile-Motion-Überarbeitung (Runde 2)

Ziel: Mobil fühlt sich so hochwertig an wie Desktop, mit eigener Choreografie für Touch und Hochformat statt „Desktop in klein“.

### Infrastruktur
- `useMotion` kennt jetzt `isDesktop`, `isMobile` (≤ 1023 px), `isTouch` (`hover: none` + `pointer: coarse`) und `canHover`.
- **`defer()`**: Setups unterhalb des Folds laufen in eigenen Tasks im selben GSAP-Kontext. Vorher entstand nach dem Laden der Plugins ein langer Task (~330 ms bei 4-facher CPU-Drosselung). SplitText bekommt pro Headline einen eigenen Task.
- `ScrollTrigger.config({ ignoreMobileResize: true })` in `loadMotion()`. Vollhöhen nutzen `svh`/`dvh`.
- **„In-view active“** (`data-active-in-view`): Auf Touch-Geräten ist ein Element `.is-active`, solange es zwischen 65 % und 35 % der Bildhöhe steht. Alle eigenen `:hover`-Regeln stecken in `@media (hover: hover)`, damit nach dem Tippen kein Hover „kleben“ bleibt. Tailwinds `hover:` tut das ohnehin.
- **Tap-Feedback**: Utility `press` (scale 0,98 · 120 ms, bei reduzierter Bewegung nur Aufhellen) auf Buttons, Karten, Filter-Chips, Auswahlkarten und Menüpunkten. Dazu `-webkit-tap-highlight-color: transparent` und ein leerer `touchstart`-Listener im Boot-Skript, ohne den `:active` auf iOS nicht greift.

### Choreografie mobil
| Sektion | Bewegungsmoment |
|---|---|
| Hero | Anrisslinie, Subline und CTAs steigen auf (CSS ab dem ersten Paint). Die Tür öffnet sich von unten, sobald das Bild ins Bild kommt (es liegt auf allen Testgeräten unter dem Fold). Danach zeichnet sich „H 2 180“, beim Scrollen gleitet das Bild samt Maßkette parallax (−6 %). |
| Intro / Headlines | zeilenweise, mobil kürzer (yPercent 60, 0,6 s, Stagger 0,06) |
| Zwei Welten | Der Clip öffnet sich an den Scroll gekoppelt (scrub), in der Bildmitte folgen Bildzoom und CTA-Linie |
| Projekte | In der Bildmitte zeichnet sich die Maßkette (DrawSVG), dazu Titel-Linie, Zoom, Parallax ±5 % im Rahmen und ein Press-State vor der View Transition |
| Prozess | **Werkbank-Stapel**: Sticky-Karten, die verdeckte tritt zurück (scale 0,94 + Abdunklung), Skizze → Farbe, vertikales Lineal mit Zähler „01 / 05“ |
| Werkstatt | Zahlen zählen hoch, auch wenn sie beim Laden schon sichtbar sind; Bild-Reveals |
| Haltung, Karriere, Cabinet, Anfrage | Headline-Reveals, Clip-Reveals, Schiebetür (Cabinet) |
| Galerie | gestaffelte Reveals, Lightbox mit Flip aus der Kachel, Wischgesten, Rubber-Band an Bild 1/N, nach unten wischen schließt |
| Menü | Schiebetür von rechts (clip-path), zeilenweise Mask-Reveals, mitzählende Nummern, Anriss unter dem aktiven Punkt; Schließen läuft rückwärts und schneller |
| Header | Lese-Fortschritt als 2-px-Anrisslinie. Blendet der Header aus, bleibt die Linie am oberen Rand. Scrollwerte sind auf [0, max] begrenzt, damit der iOS-Overscroll nicht flackert |
| Anfrage | Schritt gleitet aus der Laufrichtung herein, Fortschritt füllt sich, Haken zeichnet sich |

### Entscheidungen und verworfene Varianten
- **Hero-Headline mobil sofort sichtbar.** Gemessen (Lighthouse mobil, 3 Läufe, Median): Mit SplitText-Reveal stieg der LCP von 3,5 auf 5,4 s (+1,9 s). Mit CSS-Reveal ab dem ersten Paint lag er bei 5,0–5,4 s, weil Chrome Text, der mit opacity 0 beginnt, nicht als LCP wertet. Beide Varianten sind verworfen. Umgesetzt ist die schonende Variante aus dem Briefing: Headline steht sofort, Subline und CTAs steigen per CSS auf und warten nicht auf JS. Ergebnis: LCP 3,5 s, also wie vorher. Die Seiten-H1 der Unterseiten behalten den kurzen Reveal, denn ihr LCP-Element ist der Intro-Absatz (`/privat`: 3,5 → 3,3 s).
- **Skizze → Farbe ohne Filter**: Im Stapel entsättigt eine graue Ebene mit `mix-blend-mode: saturation`, und nur deren Opacity scrubbt. So läuft mobil kein einziger Filter-Scrub.
- **Stapel-Logik**: Ein einziger ScrollTrigger steuert alle Karten. Die Positionen werden aus dem Layout berechnet (Höhen + Gap), weil ScrollTrigger-Messungen auf Sticky-Elementen unzuverlässig sind. Passt eine Karte samt Versatz nicht in die Viewport-Höhe, bleibt es bei der Liste. iPhone SE (667 px) passt.
- **Lineal und Zähler** sind nur in der Horizontal-Strecke bzw. im Stapel sichtbar. Das statische „05 / 05“ gibt es nicht mehr.
- **Lightbox und Menü** animieren über `onEnter`/`onExit` von React Aria (Promise). Fokusfalle, Escape und Fokusrückgabe bleiben bei React Aria. Gewischt wird mit Pointer Events (`touch-action: pinch-zoom`, Pinch-Zoom bleibt erhalten). Die Buttons blättern weiter rundum, Wischen endet an Bild 1/N mit Rubber-Band.
- **View Transitions**: In Chrome Android (emuliert) morpht die Karte in den Detail-Hero. iOS Safari konnte hier nicht getestet werden (siehe unten). Fehlt `startViewTransition`, navigiert React ohne Morph, das ist der saubere Fallback.
- **`will-change`** gibt es nur während der Sichtbarkeit (Parallax per `onToggle`), nie dauerhaft.
- **Kontrast**: Die kleineren Schrittziffern im Stapel nutzen `accent-text` (5,21:1), denn `accent` hätte nur 2,93:1.
- `partialPrefetching: true` war bereits explizit gesetzt, der Build zeigt keine Warnung.

### Messwerte vorher → nachher (Lighthouse mobil, lokal, simuliertes Throttling)
Die Werte streuen auf dieser Maschine stark. TBT schwankte bei identischem Build zwischen 0,4 und 5,4 s, daher Mediane bzw. Spannen.

| Seite | Perf. vorher | Perf. nachher | LCP vorher → nachher | A11y | CLS |
|---|---|---|---|---|---|
| `/` | 86 (62–88) | 78 (71–81) | 3,5 → 3,5 s | 100 | 0 |
| `/privat` | 82 (74–86) | 88 | 3,5 → 3,3–3,6 s | 100 | 0 |
| `/projekte` | 86 | 81–82 | → 4,1 s | 100 | 0 |
| `/projekte/emser-therme` | 85 | 79–81 | → 4,1–4,2 s | 100 | 0 |
| `/anfrage` | 85 | 71 | → 3,4–3,6 s | 100 | 0 |
| `/karriere` | 82–86 | 52–73 | → 3,6 s | 100 | 0 |

- **Ziel Performance ≥ 90 nicht erreicht.** Die langen Tasks liegen fast vollständig in der React/Next-Hydration (Framework-Chunk). Eigener Motion-Code taucht nach `defer()` nur noch in kurzen Tasks auf. Nächste Hebel: Hydration verkleinern (React Aria auf `/anfrage`/`/projekte` durch native Muster ersetzen), Fraunces-Subset, Messung auf ruhiger Hardware bzw. mit PageSpeed Insights wiederholen.
- **Scrub bei 4-facher CPU-Drosselung** (Pixel 7, rAF-Intervalle beim Wheel-Scroll): Werkbank-Stapel im Median 16,7 ms (60 fps), p95 33 ms. „Zwei Welten + Projekte“ im Median 33 ms (30 fps), p95 50 ms. In diesem Abschnitt dekodieren gleichzeitig die Bilder, und der Clip-Scrub löst Repaints aus.
- INP wurde nicht separat gemessen. Die Tap-Handler sind leichtgewichtig, und lange Tasks nach dem Laden sind aufgeteilt.

### Tests
- Playwright-Projekte `iphone-13`, `iphone-se` (3rd gen, 375 × 667) und `pixel-7` führen `tests/mobile-motion.spec.ts` aus: Rundgang mit echten Wheel- und Touch-Events (CDP), Video unter `qa/videos/`. **Die iPhones laufen in Chromium mit Geräte-Emulation**, denn WebKit ist zwar installiert, braucht unter WSL aber Systembibliotheken (libgtk-4, libgraphene, libxslt, libevent), deren Installation sudo erfordert. Safari-spezifisches Verhalten (View Transitions, Overscroll, `:active`) ist damit **nicht** auf echtem WebKit geprüft.
- Letzter vollständiger Lauf: 176 bestanden, 2 fehlgeschlagen. Beide Fehler kamen aus dem neuen Reduced-Motion-Test, der die gestaltete Rahmung der „Zwei Welten“ (`inset(4%)`, Ruhezustand) als Clip wertete. Der Selektor ist korrigiert, **der korrigierte Test wurde nicht erneut ausgeführt.** Alle axe-Tests (Desktop + Mobil, mit und ohne reduzierte Bewegung) und die drei Geräte-Rundgänge waren grün.
- Desktop-Screenshots vorher liegen vor. Ein systematischer Vorher/Nachher-Vergleich wurde nicht mehr durchgeführt. Die Desktop-Pfade (Hover, Horizontal-Strecke, Hero) sind im Code unverändert, nur in `@media (hover: hover)` gekapselt.
