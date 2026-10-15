import { home } from "@/content/pages";

export function Intro() {
  const { statement, facts } = home.intro;
  return (
    <section aria-labelledby="intro-title" className="section-y border-t border-line">
      <div className="container-site grid-12 gap-y-16">
        <p className="eyebrow col-span-4 text-ink-muted md:col-span-2" aria-hidden>
          02 — Lunnebach
        </p>
        <h2
          id="intro-title"
          data-split
          className="col-span-4 text-statement font-[340] tracking-[-0.025em] md:col-span-8 lg:col-span-9 lg:col-start-3 [font-variation-settings:'opsz'_144,'SOFT'_80]"
        >
          {statement}
        </h2>
        <ul className="col-span-4 grid gap-0 border-t border-line md:col-span-8 md:grid-cols-3 lg:col-span-10 lg:col-start-3">
          {facts.map((f, i) => (
            <li key={f} className="flex gap-4 border-b border-line py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <span className="mono text-xs text-accent-text" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="eyebrow">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
