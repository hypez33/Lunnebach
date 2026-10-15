import { PageMotion } from "@/components/motion/PageMotion";
import { PageHeader } from "./PageHeader";

/** Ruhiges Textlayout für Rechtliches: Inhaltsverzeichnis links (Desktop), Text rechts, max. 68ch. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  notice,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  notice?: string;
  sections: { id: string; title: string; body: React.ReactNode }[];
}) {
  return (
    <PageMotion>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <div className="container-site grid-12 section-y gap-y-12">
        <nav aria-label="Inhalt" className="col-span-4 md:col-span-8 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow mb-3 text-ink-muted">Inhalt</p>
            <ol className="border-t border-line">
              {sections.map((s, i) => (
                <li key={s.id} className="border-b border-line">
                  <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 py-2 text-[0.9375rem]">
                    <span aria-hidden className="mono text-xs text-accent-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="link-line">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="legal col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-5">
          {notice && (
            <p className="mb-12 border-l-2 border-accent bg-paper-2 px-5 py-4 text-[0.9375rem]">
              <strong className="font-medium">Hinweis:</strong> {notice}
            </p>
          )}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-[calc(var(--header-h)+1rem)] border-t border-line pb-12 pt-8">
              <h2 id={`${s.id}-h`} className="flex items-baseline gap-4 text-h3">
                <span aria-hidden className="mono text-[0.8125rem] text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <div className="prose-measure mt-5 grid gap-4 text-ink-muted [&_a]:text-accent-text [&_a]:underline [&_strong]:font-medium [&_strong]:text-ink">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageMotion>
  );
}
