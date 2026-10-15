import { ButtonLink } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="container-site relative py-[clamp(5rem,12vw,12rem)]">
        <p className="eyebrow text-ink-muted">Fehler 404</p>
        <div className="mt-6 max-w-[420px] pt-6">
          <Dimension label="Maß nicht gefunden" animate={false} />
        </div>
        <h1 id="nf-title" className="mt-8 max-w-[16ch] text-h1">
          Diese Seite passt nicht ins Maß.
        </h1>
        <p className="mt-6 max-w-[48ch] text-lead text-ink-muted">
          Die Adresse gibt es nicht (mehr). Vielleicht finden Sie über die Startseite oder unsere Projekte, was Sie suchen.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <ButtonLink href="/projekte" variant="secondary">
            Projekte ansehen
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
