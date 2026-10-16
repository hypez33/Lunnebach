import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { home } from "@/content/pages";
import { site } from "@/content/site";

export function InquiryCta({ showMap = true }: { showMap?: boolean }) {
  const q = home.inquiry;
  return (
    <section aria-labelledby="inquiry-title" className="section-y border-t border-line bg-paper-2">
      <div className="container-site grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <Eyebrow className="text-ink-muted">
            Anfrage &amp; Anfahrt
          </Eyebrow>
          <h2 id="inquiry-title" data-split className="mt-6 text-h2">
            {q.title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-lead text-ink-muted">{q.text}</p>
          <div className="mt-10 flex flex-col items-start gap-5">
            <ButtonLink href="/anfrage">{q.cta}</ButtonLink>
            <p className="text-ink-muted">
              oder direkt anrufen:{" "}
              <a href={site.phone.href} className="text-link font-medium">
                {site.phone.display}
              </a>
            </p>
          </div>
          <dl className="mono mt-12 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line-strong pt-6 text-[0.8125rem]">
            <dt className="text-ink-muted">Adresse</dt>
            <dd>
              {site.address.street}, {site.address.zip} {site.address.city}
            </dd>
            <dt className="text-ink-muted">Telefon</dt>
            <dd>{site.phone.display}</dd>
            <dt className="text-ink-muted">E-Mail</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="link-line">
                {site.email}
              </a>
            </dd>
          </dl>
        </div>
        {showMap && (
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <MapEmbed />
          </div>
        )}
      </div>
    </section>
  );
}
