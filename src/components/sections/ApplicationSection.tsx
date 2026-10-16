import { LazyApplicationForm } from "@/components/forms/LazyApplicationForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/content/site";

export function ApplicationSection() {
  return (
    <section id="bewerbung" aria-labelledby="application-title" className="section-y scroll-mt-[var(--header-h)] bg-paper-2">
      <div className="container-site grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <Eyebrow className="text-ink-muted">
            Bewerbung
          </Eyebrow>
          <h2 id="application-title" data-split className="mt-6 text-h2">
            Kurz bewerben.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-ink-muted">
            Ein paar Angaben reichen. Lebenslauf und Zeugnisse kannst du gern anhängen – musst du aber nicht.
          </p>
          <p className="mt-6 text-ink-muted">
            Lieber per Post oder Mail? Auch gern:{" "}
            <a href={`mailto:${site.email}`} className="text-link">
              {site.email}
            </a>
          </p>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <LazyApplicationForm />
        </div>
      </div>
    </section>
  );
}
