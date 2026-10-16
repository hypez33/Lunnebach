# Prompt für Claude Code – Lunnebach: Mobile-Motion-Überarbeitung

> Alles ab der Trennlinie in Claude Code im bestehenden Projekt einfügen.

---

## Ausgangslage

Die Desktop-Version der Lunnebach-Demo steht und ist gut. **Mobil wirkt die Seite zu statisch:** Fast alle Signature-Effekte laufen nur ab 1024 px oder hängen an `:hover`. Auf dem Handy gibt es kein Hover. Ziel dieser Runde: **Mobil soll sich genauso hochwertig und lebendig anfühlen wie Desktop.** Mobil wird nicht einfach Desktop in klein. Es bekommt eine eigene, für Touch und Hochformat gedachte Choreografie.

Lies vor dem Start den aktuellen Code. Die Befunde unten stammen aus einem Review und gelten für den aktuellen Stand:

| Stelle | Befund |
|---|---|
| `src/components/motion/HeroMotion.tsx` | Schiebetür-Reveal, SplitText-Headline und Fades nur `if (isDesktop)`. Mobil laufen nur Anrisslinie und Maßkette. |
| `src/app/globals.css` | `[data-hero-hidden]` und `[data-hero-door]` werden nur in `@media (min-width: 1024px)` vorbereitet. |
| `src/components/motion/PageMotion.tsx` | `data-split="hero"` (Seiten-H1) wird mobil übersprungen. |
| `src/components/sections/Process.tsx` | Horizontal-Strecke nur Desktop. Mobil ist es eine statische Liste. Das Lineal zeigt fest „05 / 05“ und einen voll gefüllten orangen Balken ohne Funktion. |
| `TwoWorlds` (`.world`-CSS) | Aufklappen, Clip-Öffnung, Bildzoom und CTA-Linie nur über `:hover`/`:focus-within`. Mobil passiert nichts. |
| `ProjectCard` (`.card-dim`, `.card-title`) | Hover-Maßkette, Titel-Linie und Bildzoom nur bei Hover. Mobil unsichtbar. |
| `Gallery.tsx` | Zoom-Icon und Bildzoom nur bei Hover. Die Lightbox hat keine Wischgesten und kein Öffnen-/Schließen-Motion. |
| `MobileMenuDialog.tsx` | Das Menü erscheint hart, ohne Übergang. Gerade mobil ist das der meistgenutzte Moment. |
| Buttons, Links | Keine Tap-Rückmeldung (`:active`). |

---

## Leitlinien (verbindlich)

1. **Touch statt Hover:** Jeder Hover-Effekt bekommt auf Touch-Geräten ein Gegenstück. In der Regel heißt das: Der Zustand wird aktiv, sobald das Element in der Bildmitte steht („in-view active“). Dazu kommt ein kurzer Press-State beim Antippen.
2. **Scroll ist mobil die Hauptinteraktion.** Die Bewegung wird an den Scroll gekoppelt (`scrub`) oder beim Eintritt einmalig ausgelöst. Sie ist kurz, präzise und handwerklich. Das Motto bleibt: messen, anreißen, fügen.
3. **Kein Scroll-Hijacking, kein Pinning von Horizontal-Strecken auf Mobil.** Gepinnte Horizontal-Strecken fühlen sich auf dem Handy schlecht an, auch wegen der Adressleiste und des Zurückfederns. Mobil nutzen wir `position: sticky`, Scroll-Snap und scrubbed Timelines.
4. **Performance zuerst:** Animiert werden nur `transform`, `opacity` und `clip-path`. Filter (`grayscale`) dürfen höchstens auf einem Element gleichzeitig scrubben. Kein `will-change` auf Dauer. Ziele für Lighthouse Mobile: Performance ≥ 90, CLS < 0,1, INP < 200 ms, und das bei 4-facher CPU-Drosselung flüssig.
5. **Barrierefreiheit bleibt unangetastet:** `prefers-reduced-motion` und der eigene Schalter „Bewegung reduzieren“ schalten alles Neue ab. Ohne JS ist alles sichtbar. Keine Fokusfallen. Die axe-Prüfung muss weiter 0 Verstöße zeigen.
6. **LCP schützen:** Die Hero-Headline ist mobil sehr wahrscheinlich das LCP-Element. Miss das vorher und nachher. Verschlechtert eine Animation den LCP um mehr als 200 ms, nimm die schonendere Variante (siehe Phase 2).

---

## Phase 1 – Motion-Infrastruktur für Mobil erweitern

- In `src/lib/motion/useMotion.ts` die `matchMedia`-Bedingungen ergänzen:
  - `isDesktop: "(min-width: 1024px)"` (bestehend)
  - `isMobile: "(max-width: 1023px)"`
  - `isTouch: "(hover: none) and (pointer: coarse)"`
  - `canHover: "(hover: hover) and (pointer: fine)"`

  `MotionContext` entsprechend typisieren.
- `ScrollTrigger.config({ ignoreMobileResize: true })` zentral in `loadMotion()` setzen, damit das Ein- und Ausblenden der Adressleiste kein Refresh auslöst. Für Vollhöhen überall `svh`/`dvh` verwenden statt `vh`.
- Neues Hilfsmittel **„in-view active“**: ein deklaratives Attribut `data-active-in-view`. Auf Touch-Geräten setzt ein ScrollTrigger (`start: "top 65%"`, `end: "bottom 35%"`, `toggleClass: "is-active"`) die Klasse `.is-active`. In CSS bekommen alle bisherigen Hover-Selektoren das Gegenstück, z. B.:
  ```css
  @media (hover: hover) { .project-card:hover .card-dim { … } }
  .project-card.is-active .card-dim { … }
  ```
  Bestehende `:hover`-Regeln dafür in `@media (hover: hover)` kapseln, damit auf dem Handy kein „klebender“ Hover nach dem Tippen bleibt.
- **Tap-Feedback** global: `.btn`, Karten, Filter-Chips und Menü-Einträge bekommen einen `:active`-Zustand (z. B. `scale(0.98)`, 120 ms). Außerdem `-webkit-tap-highlight-color: transparent`, aber nur zusammen mit eigenem sichtbaren Feedback.
- Die Initialzustände in `globals.css` (`[data-hero-hidden]`, `[data-hero-door]`) gelten künftig für alle Breiten, weiterhin nur mit `.js`, ohne reduzierte Bewegung und mit Failsafe.

## Phase 2 – Hero mobil: „Anriss“ auch auf dem Handy

Die Choreografie wird für Hochformat neu getaktet, Gesamtdauer ≤ 1,4 s:
1. Die Anrisslinie zieht von links (bleibt wie bisher).
2. Das Bild öffnet sich als Schiebetür, auf Mobil **von unten nach oben** (`inset(100% 0 0 0)` → `inset(0)`). Das passt besser zum Hochformat. Im Bild leichtes `scale 1.06 → 1`.
3. Headline: zeilenweise Reveal mit SplitText, aber **schneller und mit kürzerem Weg** (`yPercent: 60`, `0.6 s`, Stagger `0.06`). Vorher und nachher den LCP messen (Lighthouse Mobile, 3 Läufe, Median). Verschlechtert er sich um mehr als 200 ms, nur Subline und CTAs animieren und die Headline sofort zeigen.
4. Subline und CTAs per Fade-up mit Stagger.
5. Die vertikale Maßkette „H 2 180“ zeichnet sich nach dem Bild.
6. Neu, nur mobil: Beim ersten Scrollen gleitet das Bild **leicht parallax** (`yPercent: -6`, scrub) und die Maßkette bleibt am Bild „kleben“. Das bringt sofort Tiefe.

Die Seiten-H1 der Unterseiten (`data-split="hero"`) bekommen mobil dasselbe kurze Reveal, mit derselben LCP-Prüfung.

## Phase 3 – Prozess mobil: „Werkbank-Stapel“ statt statischer Liste

Für `< 1024 px` und volle Bewegung eine eigene mobile Variante bauen. Die Desktop-Horizontal-Strecke bleibt unverändert.

- Die 5 Schritte werden **gestapelte Karten mit `position: sticky`**. Jede Karte klebt mit leicht steigendem Versatz oben (`top: calc(var(--header-h) + 1rem + var(--i) * 0.75rem)`), die nächste schiebt sich darüber. Die darunterliegende skaliert minimal zurück (`scale 1 → 0.94`) und dunkelt ab (Overlay-Opacity, kein Filter). Gesteuert wird das per scrubbed ScrollTrigger je Karte.
- Pro Karte: Ziffer, Titel, Text und Bild. Das Bild läuft scrubbed von der **Skizzen-Anmutung zu Farbe**, während die Karte in Position kommt. Dafür die vorhandene `--c`-Logik wiederverwenden.
- **Das Lineal wird vertikal** und sitzt als schmale Leiste am linken Rand der Sektion (sticky). Es füllt sich mit dem Scroll-Fortschritt der Sektion. Der Zähler „01 / 05“ zählt mit.
- Ohne JS, bei reduzierter Bewegung oder wenn Sticky nicht greift: normale vertikale Liste, **Lineal und Zähler ausblenden** (der heutige Zustand „05 / 05“ mit vollem Balken darf nirgends mehr erscheinen).
- Keine fokussierbaren Elemente in den Karten, alternativ korrektes Scroll-to-Focus. Die Sticky-Höhe darf auf kleinen Geräten (iPhone SE, 667 px) den Text nicht abschneiden. Bei zu wenig Höhe greift der Fallback auf die Liste.

## Phase 4 – Zwei Welten, Projektkarten, Galerie: Hover → In-View

- **Zwei Welten:** Die Karten liegen untereinander. Erreicht eine Karte die Bildmitte, wird sie `.is-active`. Dann öffnet sich der Clip von `inset(4%)` auf `0`, das Bild zoomt auf 1.03 und die CTA-Linie läuft durch. Zusätzlich scrubbed: Das Bild öffnet sich proportional zum Scroll, fühlbar „an den Finger gekoppelt“. Das gegenseitige Schrumpfen per `flex-grow` bleibt Desktop.
- **Projektkarten** (Startseite und `/projekte`): `.is-active` zeigt die Hover-Maßkette an der Bildunterkante (zeichnet sich per DrawSVG, statt nur einzublenden), lässt die Titel-Linie durchlaufen und das Bild leicht zoomen. Dazu ein dezenter Parallax des Bildes innerhalb seines Rahmens (scrub, `yPercent ±5`). Beim Antippen ein Press-State, danach die View Transition zur Detailseite. Prüfen, dass das Morphing auf iOS Safari und Chrome Android funktioniert. Wenn nicht: sauberer Fallback.
- **Galerie:** Das Zoom-Icon ist auf Touch dauerhaft sichtbar. Die Bilder bekommen beim Eintritt ein Reveal mit leichtem Stagger. **Lightbox:**
  - Öffnen und Schließen animiert. Das Bild wächst aus der angetippten Kachel (Flip). Bei reduzierter Bewegung wird nur ein- und ausgeblendet.
  - **Wischgesten** links/rechts zum Blättern und nach unten zum Schließen, mit GSAP `Observer` (`type: "touch,pointer"`) oder Pointer Events. Das Bild folgt dem Finger, ab einem Schwellwert schnappt es zum nächsten Bild. Die Buttons bleiben als zugängliche Alternative.
  - Bei Bild 1 und Bild N gibt es einen Rubber-Band-Effekt statt hartem Stopp. Der Zähler wird per `aria-live` angesagt (wie bisher).
- Nebenbei korrigieren: In `Gallery.tsx` liegt ein `<div>` im `<button>` (ungültiges HTML). Ersetze ihn durch `<span className="block …">`.

## Phase 5 – Mobile Menü, Header, Seitenfluss

- **Mobile-Menü** als Schiebetür, passend zur Cabinet-Idee: Das Overlay fährt per `clip-path` von rechts auf (0,5 s, `lunnebach`-Ease). Die Menüpunkte erscheinen zeilenweise mit Mask-Reveal (Stagger 0,05). Die Nummern „01 —“ zählen mit, und eine Anrisslinie zieht unter dem aktiven Punkt. Schließen läuft rückwärts und schneller. Umsetzen über die Render-Props/Attribute von React Aria (`isEntering`/`isExiting` bzw. `data-entering`/`data-exiting`), damit Fokusverwaltung und Escape intakt bleiben.
- **Lese-Fortschritt als Anrisslinie:** Unter dem Header läuft mobil eine 2 px Accent-Linie mit dem Seiten-Scroll mit (scrub). Sie ist dezent, gehört zur Marke und ersetzt nichts.
- Header: Ein- und Ausblenden beim Scrollen bleibt. Mobil zusätzlich prüfen, dass er beim Zurückfedern an Seitenanfang und -ende (iOS-Overscroll) nicht flackert.
- **Formular-Assistent `/anfrage`:** Schrittwechsel animiert. Der neue Schritt gleitet herein (vorwärts von rechts, zurück von links, 0,35 s), der Fortschrittsbalken füllt sich animiert, und Auswahlkarten bekommen beim Antippen einen Press- und Check-Effekt (Haken zeichnet sich). Der Fokus springt weiter auf die Schrittüberschrift.
- Zahlen in der Werkstatt-Sektion: Hochzählen funktioniert mobil. Prüfe, dass die `isInitiallyVisible`-Logik mobil nicht zu viele Effekte überspringt. Auf schmalen Geräten liegt mehr Inhalt „above the fold“, als gedacht.

## Phase 6 – Feinschliff und Kleinigkeiten aus dem Review

- `next.config.ts`: Die Warnung zu `partialPrefetching` beheben. Explizit `true` setzen und testen.
- Sichtbare Platzhalter in der Demo entschärfen. `[Ort]`, `[Jahr]`, `[PLATZHALTER: Umfang, Jahr]`, `[Name]` und vor allem das **groß gesetzte Platzhalter-Zitat** beim Friseursalon wirken beim Kunden unfertig. Lösung: plausible, klar als Beispiel markierte Formulierungen in `content/*.ts`, alles in `TODO-CONTENT.md` gelistet. Die Zitat-Sektion nur rendern, wenn `quote.approved === true`.
- Logo: Die PNGs sind sehr klein (300 × 69 px) und werden auf Retina unscharf. Bis das SVG vom Kunden kommt, prüfen, ob die größte verfügbare Variante genutzt wird. In `TODO-CONTENT.md` als Priorität markieren.

## Phase 7 – Testen wie ein Mensch mit Handy

- Playwright-Projekte für **iPhone 13, iPhone SE und Pixel 7** (`devices[...]`, `hasTouch`, `isMobile`).
- Echtes Scrollen per `page.mouse.wheel` bzw. Touch-Gesten, **nicht** per `window.scrollTo`. Mit Smooth-Scroll lösen sprunghafte `scrollTo`-Aufrufe die ScrollTrigger nicht zuverlässig aus.
- Pro Gerät **ein Video** aufnehmen (`recordVideo`): Startseite komplett durchscrollen, Menü öffnen und schließen, Projektkarte antippen, in der Galerie wischen, Anfrage-Assistent durchklicken. Schau dir die Videos selbst kritisch an: Ruckeln, Springen, zu viel oder zu wenig Bewegung, klebende Zustände. Bessere nach, bis es sich wie eine native Premium-App anfühlt.
- CPU 4-fach drosseln (CDP `Emulation.setCPUThrottlingRate`) und prüfen, dass Scrub-Animationen flüssig bleiben. Lighthouse Mobile mit Werten vorher/nachher in `DECISIONS.md`.
- Bestehende axe-Tests müssen grün bleiben. Ergänze einen Test, der bei `reducedMotion: "reduce"` prüft, dass alle Inhalte sofort sichtbar sind und kein Element `visibility: hidden` oder einen Clip behält.
- Desktop darf sich nicht verschlechtern. Desktop-Screenshots vorher/nachher vergleichen.

Nach jeder Phase: `npm run lint`, `npx tsc --noEmit`, `npm run build`, Fehler beheben, committen.

---

## Definition of Done

- [ ] Auf einem Handy hat jede Sektion der Startseite mindestens einen sichtbaren, sinnvollen Bewegungsmoment. Keine Sektion wirkt „tot“.
- [ ] Kein Effekt hängt mobil ausschließlich an `:hover`. Hover-Regeln sind in `@media (hover: hover)` gekapselt.
- [ ] Der Prozess hat mobil eine eigene Sticky-Stapel-Variante mit funktionierendem vertikalem Lineal. Das statische „05 / 05“ ist weg.
- [ ] Mobile-Menü, Lightbox (mit Wischgesten) und Anfrage-Assistent haben Übergänge.
- [ ] `prefers-reduced-motion` und der eigene Schalter schalten alles Neue ab. Ohne JS ist alles sichtbar.
- [ ] Lighthouse Mobile: Performance ≥ 90, Accessibility 100. LCP ist nicht schlechter als vorher plus 200 ms.
- [ ] axe: 0 Verstöße auf allen Routen, Desktop und Mobil.
- [ ] Videos der drei Geräte liegen unter `qa/videos/`. `DECISIONS.md` dokumentiert Choreografie, Messwerte und verworfene Varianten.

Zum Schluss: Fasse kurz zusammen, was sich mobil geändert hat, welche Messwerte du hast und welche zwei Effekte du als Nächstes verfeinern würdest.
