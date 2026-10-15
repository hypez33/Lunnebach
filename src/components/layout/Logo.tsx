import Image from "next/image";
import { img } from "@/content/images";

const dark = img("brand/logo-2"); // dunkle Schrift → für hellen Grund
const light = img("brand/logo-weiss-orange"); // helle Schrift → für dunklen Grund

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
