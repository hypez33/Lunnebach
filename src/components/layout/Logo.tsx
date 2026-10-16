import Image from "next/image";
import { img } from "@/content/images";

const light = img("brand/logo-weiss-orange"); // helle Schrift → für dunklen Grund (300 × 69, größte verfügbare PNG)
// Dunkle Schrift → für hellen Grund. Abgeleitet aus der 300-px-Variante (scripts/derive-logo.mjs),
// weil das Original logo-2.png nur 200 × 46 px hat und auf Retina unscharf wird.
const dark = { ...light, src: "/images/brand/logo-dunkel.png", alt: img("brand/logo-2").alt };

/**
 * Logo als PNG (SVG angefordert, siehe TODO-CONTENT.md).
 * Beide Varianten liegen übereinander; `tone` bzw. die Header-Variable entscheidet, welche sichtbar ist.
 */
export function Logo({ tone = "auto", className = "" }: { tone?: "light" | "dark" | "auto"; className?: string }) {
  return (
    <span className={`logo relative inline-block aspect-[300/69] ${className}`} data-tone={tone}>
      <Image
        src={dark.src}
        width={dark.width}
        height={dark.height}
        alt=""
        aria-hidden
        unoptimized
        className="logo-on-light absolute inset-0 h-full w-full object-contain"
      />
      <Image
        src={light.src}
        width={light.width}
        height={light.height}
        alt=""
        aria-hidden
        unoptimized
        className="logo-on-dark absolute inset-0 h-full w-full object-contain"
      />
      <span className="sr-only">{dark.alt}</span>
    </span>
  );
}
