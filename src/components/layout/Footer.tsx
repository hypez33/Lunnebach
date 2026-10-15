import Image from "next/image";
import Link from "next/link";
import { img } from "@/content/images";
import { legalNav, mainNav, site } from "@/content/site";
import { MotionToggle } from "./MotionToggle";

const signet = img("brand/rolf-lunnebach-weiss");

export function Footer() {
  return (
    <footer data-theme="dark" className="theme-dark relative overflow-hidden">
      <div className="container-site pt-[clamp(4rem,8vw,8rem)]">
        <div className="grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="eyebrow text-paper-muted">Lunnebach · Koblenz</p>
            <p className="mt-6 font-display text-[clamp(2.25rem,1.4rem+3vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              Die <span className="text-accent">c</span>reative
              <br />
              Holzwerkstätte.
            </p>
            <Image
              src={signet.src}
              width={signet.width}
              height={signet.height}
              alt={signet.alt}
              sizes="(min-width: 1024px) 300px, 60vw"
              className="mt-10 w-[min(300px,70%)]"
            />
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-7">
            <h2 className="eyebrow !font-mono !tracking-[0.12em] text-paper-muted">Kontakt</h2>
            <address className="mt-5 not-italic leading-relaxed">
              {site.legalName}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </address>
            <ul className="mt-5 grid gap-1">
              <li>
                <a href={site.phone.href} className="link-line inline-flex min-h-11 items-center">
                  Telefon {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-line inline-flex min-h-11 items-center">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-3">
            <h2 className="eyebrow !font-mono !tracking-[0.12em] text-paper-muted">Öffnungszeiten</h2>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {site.openingHours.map((o) => (
                <div key={o.days} className="contents">
                  <dt className="text-paper-muted">{o.days}</dt>
                  <dd>{o.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <a
                href={site.cabinet.url}
                className="group inline-flex min-h-11 items-center gap-2"
                rel="noopener"
                target="_blank"
              >
                <span className="link-line">
                  {site.cabinet.name} – {site.cabinet.tagline}
                </span>
                <span aria-hidden>↗</span>
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </a>
            </p>
          </div>
        </div>

        <div className="mt-[clamp(4rem,8vw,7rem)] grid-12 items-end gap-y-8 border-t border-line-dark py-8">
          <nav aria-label="Seiten" className="col-span-4 md:col-span-8 lg:col-span-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line inline-flex min-h-11 items-center">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/anfrage" className="link-line inline-flex min-h-11 items-center">
                  Anfrage
                </Link>
              </li>
            </ul>
          </nav>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:justify-self-end">
            <MotionToggle tone="dark" />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line-dark py-6 text-sm text-paper-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {site.copyrightYear} {site.legalName}
          </p>
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap gap-x-5">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line inline-flex min-h-11 items-center">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
