# Lunnebach – Showcase-Demo für den Relaunch von lunnebach.com

Proof of Concept für die Website der Tischlerei Rolf Lunnebach, „Die creative Holzwerkstätte“, Koblenz.
Designkonzept **„Auf den Millimeter“**: Die Seite wirkt wie eine Werkzeichnung, die beim Scrollen zum Möbel wird.

- Gestaltungs- und Technikentscheidungen: [`DECISIONS.md`](DECISIONS.md)
- Offene Inhalte, Freigaben, Bilder: [`TODO-CONTENT.md`](TODO-CONTENT.md)

## Start

Voraussetzung: Node.js ≥ 20.9.

```bash
npm install
npm run dev          # http://localhost:3000
```

Produktionsbuild lokal:

```bash
npm run build
npm run start
```

## Skripte

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklung (Turbopack) |
| `npm run build` / `npm run start` | Produktionsbuild / -server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Playwright-Suite: axe (WCAG 2.2 AA, serious/critical), Tastatur, Reflow 320 px, ohne JS, 404, Redirects. Startet den Produktionsserver selbst (Build vorher ausführen). Einmalig: `npx playwright install chromium` |
| `npm run test:a11y` | nur die axe-/Struktur-Tests |
| `npm run assets:fetch` | Bilder der alten Website nach `public/images/<ordner>/` laden (`--force` überschreibt) |
| `npm run assets:manifest` | `src/content/images.ts` (Maße, Alt-Texte, Blur-Placeholder) und Akzentfarbe aus dem Logo neu erzeugen |
| `npm run contrast` | Kontraste aller Token-Kombinationen prüfen |

## Struktur

```
src/
  app/                    Routen (App Router), layout.tsx, globals.css (Design-Tokens in @theme)
    projekte/[slug]/      Projektdetail + OG-Bild je Projekt
    anfrage/, anfrage/danke/
    sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  proxy.ts                404 für unbekannte Projekt-Slugs
  components/
    layout/               Header, Footer, MobileMenu (+ lazy Dialog), SkipLink, MotionToggle, Logo
    ui/                   ButtonLink, Eyebrow, Figure, Dimension (Maßkette), ProjectCard, Gallery (Lightbox),
                          VideoEmbed, MapEmbed, PageHeader, LegalPage, Stat, AnchorNav
    sections/             Hero, Intro, TwoWorlds, FeaturedProjects, Process, Workshop, Values, CareerTeaser,
                          CabinetTeaser, InquiryCta, ProjectGrid, ServiceSection, WorldProjects, ApplicationSection
    forms/                InquiryWizard, ApplicationForm, Feldkomponenten (React Aria), ThankYou
    motion/               PageMotion (deklarative Scroll-Motion), HeroMotion
  content/                site, projects, services, process, values, jobs, team, pages, images (generiert), types
  lib/
    motion/               gsap.ts (zentrale Registrierung, Plugins lazy), eases.ts, preference.ts, useMotion.ts
    forms/                Zod-Schemas, Server Actions
    og.tsx, jsonld.ts
scripts/                  fetch-assets.mjs, build-image-manifest.mjs, contrast.mjs, derive-logo.mjs
tests/                    a11y.spec.ts, keyboard.spec.ts, mobile-motion.spec.ts (Geräte-Rundgang + Videos → qa/videos/)
assets/fonts/             TTF-Schriften für OG-Bilder (OFL)
```

### Motion in eigenen Sektionen nutzen

Server Components brauchen kein eigenes JavaScript – Attribute genügen, `<PageMotion>` (umschließt jede Seite)
übernimmt den Rest:

```tsx
<h2 data-split>Zeilenweiser Reveal</h2>           // Moment 5
<div data-clip="up | left | door">…</div>          // Bild-Reveal per clip-path
<Dimension label="2 840" />                        // Moment 2 – Maßkette zeichnet sich
<span data-count={30} data-prefix="~">~30</span>   // zählt einmalig hoch
```

Alles respektiert `prefers-reduced-motion` und den Schalter „Bewegung reduzieren“ (`data-motion="reduced"` am `<html>`).

## Payload CMS später anschließen

Die Inhalte sind bereits wie Collections geschnitten (`src/content/types.ts`):

| Datei | Payload | Hinweise |
|---|---|---|
| `projects.ts` | Collection `projects` | `slug` als Unique-Feld; `heroImage`/`gallery[].image` → Upload-Relation auf `media`; `story` als Group; `dimension` als Group (label, orientation) |
| `services.ts` | Collection `services` | `world` als Select (`privat`/`gewerbe`), `images` → Relation `media` (hasMany) |
| `jobs.ts` | Collection `jobs` | `tasks`/`profile`/`offer` als Array-Felder; `benefits` → Global `career` |
| `team.ts` | Collection `team` | `image` → `media`; Einwilligung als Checkbox-Feld |
| `pages.ts` | Collection `pages` (Blocks) oder Globals je Seite | Startseiten-Sektionen 1:1 als Blocks |
| `site.ts` | Global `site` | Kontakt, Öffnungszeiten, Cabinet-Link |
| `images.ts` | Collection `media` | `alt`, `altReviewed`, `originalUrl`, `category`; `blurDataURL` per Upload-Hook (sharp) erzeugen |

Vorgehen: Payload 3 in dieselbe Next-App einbinden (`@payloadcms/next`), die Getter in `src/content/*`
(`getProject`, `featuredProjects` …) durch `payload.find()` ersetzen und mit `'use cache'` + `cacheTag('projects')`
cachen; im `afterChange`-Hook `revalidateTag('projects')`. `generateStaticParams` liest die Slugs dann aus Payload.
Die Komponenten bleiben unverändert, weil sie nur die Typen aus `types.ts` kennen.

Formulare: `submitInquiry` / `submitApplication` (`src/lib/forms/actions.ts`) schreiben dann in eine Collection
`inquiries` bzw. `applications` und versenden eine Benachrichtigung; Uploads gehen in `media` (privat).

## Nächste Schritte

1. **Bildmaterial:** neue Fotos bzw. Originaldateien in ≥ 2 400 px und das Logo als SVG – der größte sichtbare Qualitätssprung
   (Liste in `TODO-CONTENT.md`, Abschnitt 5). Danach Hero und „Zwei Welten“ vollflächig statt gerahmt.
2. **Performance mobil ≥ 90 auf allen Seiten:** Fraunces als statische Display-Instanz bzw. enger Subset (derzeit 120 KB),
   React Aria auf `/projekte` und `/anfrage` schlanker (native Radio/Checkbox-Muster für die Auswahlkarten), danach erneut messen.
3. **Echter Betrieb:** Payload CMS anbinden, Formular-Versand und Uploads, manuelle Screenreader-Tests (NVDA, VoiceOver iOS)
   und Feinschliff der Motion auf echten Geräten (insbesondere Safari und View Transitions).
