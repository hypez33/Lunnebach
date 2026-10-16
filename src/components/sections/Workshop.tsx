import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { Stat } from "@/components/ui/Stat";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { img } from "@/content/images";
import { home } from "@/content/pages";
import { site } from "@/content/site";

const signet = img("brand/rolf-lunnebach-weiss");
const teamPhoto = img("team/team-lunnebach");
const poster = img("team/lunnebach-team2");

export function Workshop() {
  const w = home.workshop;
  return (
    <section aria-labelledby="workshop-title" data-theme="dark" className="theme-dark section-y relative overflow-hidden">
      <div className="container-site">
        <Eyebrow as="h2" id="workshop-title" className="!font-mono !tracking-[0.12em] text-paper-muted">
          {w.eyebrow}
        </Eyebrow>

        <figure className="mt-[clamp(2.5rem,5vw,5rem)] grid-12 gap-y-10">
          <blockquote className="col-span-4 md:col-span-8 lg:col-span-10">
            <p
              data-split
              className="font-display text-[clamp(1.875rem,1rem+3.2vw,4.25rem)] font-[330] leading-[1.08] tracking-[-0.02em] [font-variation-settings:'opsz'_144,'SOFT'_100]"
            >
              <span className="text-accent">„</span>
              {w.quote}
              <span className="text-accent">“</span>
            </p>
          </blockquote>
          <figcaption className="col-span-4 flex flex-col gap-6 md:col-span-8 md:flex-row md:items-end md:justify-between lg:col-span-10">
            <span className="eyebrow text-paper-muted">— {w.author}</span>
            <Image src={signet.src} width={signet.width} height={signet.height} alt="" className="w-[220px] opacity-90" sizes="220px" />
          </figcaption>
        </figure>

        <div className="mt-[clamp(4rem,8vw,8rem)] grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {w.stats.map((s) => (
            <Stat
              key={s.label}
              value={s.value}
              label={s.label}
              prefix={"prefix" in s ? s.prefix : ""}
              suffix={"suffix" in s ? s.suffix : ""}
              decimals={"decimals" in s ? s.decimals : 0}
            />
          ))}
        </div>

        <div className="mt-[clamp(4rem,8vw,8rem)] grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <Figure image={teamPhoto} sizes="(min-width: 1024px) 600px, 100vw" reveal="left" caption="Das Team in der Werkstatt, Koblenz" className="[&_figcaption]:text-paper-muted" />
            <p className="mt-8 max-w-[44ch] text-lead">{w.text}</p>
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7 lg:mt-32">
            <p className="eyebrow mb-4 text-paper-muted">Film · Einblick in die Werkstatt</p>
            <VideoEmbed id={site.youtubeId} title="Lunnebach – Einblick in die Werkstatt (YouTube)" poster={poster} />
          </div>
        </div>
      </div>
    </section>
  );
}
