import Image from "next/image";
import Link from "next/link";
import { HeroTeamMotion } from "@/components/motion/HeroTeamMotion";
import { img } from "@/content/images";

const team = img("team/team-lunnebach");

/** Das Werkstattfenster füllt auf Desktop die Fläche unter den Hero-CTAs. */
export function HeroTeam() {
  return (
    <HeroTeamMotion>
      <Link href="/werkstatt" className="hero-team-link group" aria-label="Unser Team und die Werkstatt kennenlernen">
        <div className="hero-team-visual">
          <div data-team-reveal className="hero-team-window grain">
            <div data-team-scroll className="hero-team-scroll">
              <div data-team-pointer className="hero-team-pointer">
                <Image
                  src={team.src}
                  alt={team.alt}
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 42vw, 1px"
                  placeholder="blur"
                  blurDataURL={team.blurDataURL}
                  quality={85}
                  className="object-cover object-[50%_10%]"
                />
              </div>
            </div>
          </div>
          <svg aria-hidden focusable="false" className="hero-team-marks" viewBox="0 0 600 250" preserveAspectRatio="none">
            <path d="M0 22V0H22M578 250H600V228" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="hero-team-caption">
          <span className="mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">Eigene Werkstatt · Koblenz</span>
          <p className="font-display text-[clamp(1.25rem,1.6vw,1.625rem)] leading-[1.1] tracking-[-0.02em]">
            Das Team hinter Ihrem Raum.
          </p>
          <span className="hero-team-cta">
            <span className="link-line">Team &amp; Werkstatt</span>
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13 13 3M3 3h10v10" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
        </div>
      </Link>
    </HeroTeamMotion>
  );
}
