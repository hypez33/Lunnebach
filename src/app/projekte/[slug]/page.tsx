import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { PageMotion } from "@/components/motion/PageMotion";
import { InquiryCta } from "@/components/sections/InquiryCta";
import { Arrow } from "@/components/ui/ButtonLink";
import { Dimension } from "@/components/ui/Dimension";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Gallery } from "@/components/ui/Gallery";
import { img } from "@/content/images";
import { getNextProject, getProject, projects, worldLabel } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projekte/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} – ${worldLabel[project.world]} · ${project.category}`,
    description: `${project.teaser} Ein Projekt der Tischlerei Lunnebach, Koblenz.`,
    alternates: { canonical: `/projekte/${project.slug}` },
    openGraph: { type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projekte/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const hero = img(project.heroImage);
  const next = getNextProject(project.slug);
  const nextImage = img(next.heroImage);
  const index = projects.indexOf(project);
  const vertical = project.dimension.orientation === "vertical";

  const meta = [
    { label: "Kategorie", value: `${worldLabel[project.world]} · ${project.category}` },
    { label: "Ort", value: project.location },
    { label: "Leistungen", value: project.services.join(", ") },
    { label: "Jahr", value: project.year },
  ];

  const story = [
    { n: "01", title: "Aufgabe", text: project.story.task },
    { n: "02", title: "Lösung", text: project.story.solution },
    { n: "03", title: "Ergebnis", text: project.story.result },
  ];

  return (
    <>
      <article aria-labelledby="project-title">
        {/* Hero */}
        <header className="relative overflow-hidden pt-[var(--header-h)]">
          <div aria-hidden className="drafting-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="container-site relative pb-[clamp(3rem,6vw,6rem)] pt-[clamp(1.5rem,4vw,3rem)]">
            <Link
              href="/projekte"
              transitionTypes={["nav-back"]}
              className="group inline-flex min-h-11 items-center gap-3 text-[0.9375rem] font-medium"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              <span className="link-line">Alle Projekte</span>
            </Link>

            <div className="grid-12 mt-[clamp(1.5rem,4vw,3rem)] gap-y-10">
              <div className="col-span-4 md:col-span-8 lg:col-span-7">
                <div className={`relative ${vertical ? "pr-10" : "pt-9"}`}>
                  <div className={vertical ? "absolute bottom-0 right-0 top-0" : "absolute inset-x-0 top-0"}>
                    <Dimension label={project.dimension.label} orientation={project.dimension.orientation} side="start" />
                  </div>
                  <div className="relative overflow-hidden bg-paper-2" style={{ maxWidth: hero.width }}>
                    <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                      <div className="grain relative" style={{ aspectRatio: `${hero.width} / ${hero.height}` }}>
                        <Image
                          src={hero.src}
                          alt={hero.alt}
                          fill
                          preload
                          sizes="(min-width: 1024px) 800px, 100vw"
                          placeholder="blur"
                          blurDataURL={hero.blurDataURL}
                          quality={85}
                          className="object-cover"
                        />
                      </div>
                    </ViewTransition>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-end md:col-span-8 lg:col-span-4 lg:col-start-9">
                <Eyebrow number={`Pos. ${String(index + 1).padStart(2, "0")}`} className="text-ink-muted">
                  Projekt
                </Eyebrow>
                <h1
                  id="project-title"
                  data-split="hero"
                  data-hero-hidden
                  className="mt-5 text-h1 tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_60]"
                >
                  {project.title}
                </h1>
                <p className="mt-6 text-lead text-ink-muted">{project.teaser}</p>
              </div>
            </div>

            {/* Meta-Leiste */}
            <dl className="mono mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 border-t border-line-strong text-[0.8125rem] md:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label} className="border-b border-line py-4 pr-4 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                  <dt className="uppercase tracking-[0.1em] text-ink-muted">{m.label}</dt>
                  <dd className="mt-1.5 text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* Aufgabe / Lösung / Ergebnis */}
        <section aria-label="Projektgeschichte" className="section-y border-t border-line">
          <div className="container-site grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-14">
            {story.map((s) => (
              <div key={s.n} className="border-t border-ink pt-6">
                <p className="mono text-[0.8125rem] text-accent-text" aria-hidden>
                  {s.n} —
                </p>
                <h2 className="mt-4 text-h3">{s.title}</h2>
                <p className="mt-4 max-w-[44ch] text-ink-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Galerie */}
        <section aria-labelledby="gallery-title" className="pb-[var(--spacing-section)]">
          <div className="container-site">
            <div className="mb-[clamp(2.5rem,5vw,4rem)] flex items-end justify-between gap-6 border-b border-line pb-6">
              <h2 id="gallery-title" data-split className="text-h2">
                Galerie
              </h2>
              <p className="mono text-[0.8125rem] text-ink-muted">{project.gallery.length} Bilder</p>
            </div>
            <Gallery title={project.title} items={project.gallery.map((g) => ({ image: img(g.image), caption: g.caption }))} />
          </div>
        </section>

        {project.quote && (
          <section aria-label="Kundenstimme" data-theme="dark" className="theme-dark section-y">
            <figure className="container-site">
              <blockquote>
                <p className="max-w-[28ch] font-display text-[clamp(1.875rem,1rem+3vw,4rem)] font-[330] leading-[1.1] tracking-[-0.02em]">
                  <span className="text-accent">„</span>
                  {project.quote.text}
                  <span className="text-accent">“</span>
                </p>
              </blockquote>
              <figcaption className="eyebrow mt-8 text-paper-muted">— {project.quote.author}</figcaption>
            </figure>
          </section>
        )}
      </article>

      {/* Nächstes Projekt – großer Übergang */}
      <nav aria-label="Nächstes Projekt" className="border-t border-line">
        <Link
          href={`/projekte/${next.slug}`}
          transitionTypes={["nav-forward"]}
          className="next-project group container-site grid-12 items-center gap-y-8 py-[clamp(4rem,9vw,9rem)]"
        >
          <div className="col-span-4 md:col-span-5 lg:col-span-6">
            <p className="eyebrow text-ink-muted">Nächstes Projekt</p>
            <p className="mt-5 font-display text-[clamp(2.5rem,1.5rem+4.5vw,6.5rem)] leading-[1] tracking-[-0.03em] [font-variation-settings:'opsz'_144]">
              <span className="card-title">{next.title}</span>
            </p>
            <p className="mono mt-5 text-[0.8125rem] uppercase tracking-[0.1em] text-ink-muted">
              {worldLabel[next.world]} · {next.category} · {next.location}
            </p>
            <span aria-hidden className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink transition-colors group-hover:bg-ink group-hover:text-paper">
              <Arrow />
            </span>
          </div>
          <div className="col-span-4 md:col-span-3 lg:col-span-5 lg:col-start-8">
            <div className="overflow-hidden bg-paper-2" style={{ maxWidth: nextImage.width }}>
              <ViewTransition name={`project-${next.slug}`} share="morph" default="none">
                <div className="grain relative" style={{ aspectRatio: "4 / 3" }}>
                  <Image
                    src={nextImage.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    placeholder="blur"
                    blurDataURL={nextImage.blurDataURL}
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo-out)] group-hover:scale-[1.03]"
                  />
                </div>
              </ViewTransition>
            </div>
          </div>
        </Link>
      </nav>

      <InquiryCta number={null} showMap={false} />
      <PageMotion />
    </>
  );
}
