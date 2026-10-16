import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow: string;
  number?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  /** rechte Spalte (z. B. Sprungmarken, Meta) */
  aside?: React.ReactNode;
};

/** Seitenkopf der Unterseiten: Eyebrow, H1 (zeilenweise beim Laden; mobil kürzer), Intro. */
export function PageHeader({ eyebrow, number = "01", title, intro, children, aside }: Props) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-[var(--header-h)]">
      <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="container-site relative pb-[clamp(3rem,6vw,6rem)] pt-[clamp(2.5rem,6vw,6rem)]">
        <div className="flex items-center justify-between gap-6">
          <Eyebrow number={number} className="text-ink-muted">
            {eyebrow}
          </Eyebrow>
          <p aria-hidden className="eyebrow hidden text-ink-muted md:block">
            Lunnebach · Koblenz
          </p>
        </div>
        <svg aria-hidden focusable="false" className="mt-5 block h-[2px] w-full text-accent" viewBox="0 0 1000 2" preserveAspectRatio="none">
          <path d="M0 1H1000" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <div className="grid-12 mt-[clamp(2rem,5vw,4.5rem)] gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <h1 data-split="hero" data-hero-hidden className="text-h1 tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_60]">
              {title}
            </h1>
            {intro && <p className="mt-8 max-w-[56ch] text-lead text-ink-muted">{intro}</p>}
            {children}
          </div>
          {aside && <div className="col-span-4 md:col-span-8 lg:col-span-3 lg:col-start-10 lg:self-end">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
