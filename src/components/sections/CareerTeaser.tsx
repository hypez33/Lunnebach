import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { img } from "@/content/images";
import { home } from "@/content/pages";

const siegel = img("brand/siegel");
const photo = img("team/team4");
const photo2 = img("team/team5");

export function CareerTeaser() {
  const c = home.career;
  return (
    <section aria-labelledby="career-title" data-theme="dark" className="theme-dark section-y relative overflow-hidden">
      <div className="container-site grid-12 items-center gap-y-14">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          <Eyebrow className="text-paper-muted">
            Karriere
          </Eyebrow>
          <h2 id="career-title" data-split className="mt-6 text-h2">
            {c.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lead text-paper-muted">{c.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <ButtonLink href="/karriere">{c.cta}</ButtonLink>
            <Image src={siegel.src} width={siegel.width} height={siegel.height} alt={siegel.alt} sizes="160px" className="h-auto w-[160px]" />
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
          <Figure image={photo} sizes="(min-width: 1024px) 300px, 50vw" reveal="up" />
          <Figure image={photo2} sizes="(min-width: 1024px) 300px, 50vw" reveal="up" className="mt-16" />
        </div>
      </div>
    </section>
  );
}
