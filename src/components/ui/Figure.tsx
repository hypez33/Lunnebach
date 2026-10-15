import Image from "next/image";
import type { ImageAsset } from "@/content/images";

type Props = {
  image: ImageAsset;
  /** sizes-Attribut – realistisch angeben, Bilder sind meist nur 800 px breit */
  sizes: string;
  className?: string;
  frameClassName?: string;
  imgClassName?: string;
  /** clip-path-Reveal beim Scrollen (PageMotion) */
  reveal?: "up" | "down" | "left" | "door" | false;
  grain?: boolean;
  preload?: boolean;
  caption?: string;
  /** Erzwingt ein Seitenverhältnis (Bild wird per object-cover beschnitten) */
  aspect?: string;
  /** Breite auf native Bildbreite begrenzen (Standard). Nur mit Gestaltungstrick (Grain/Rahmen) aufheben. */
  cap?: boolean;
  /** Zusätzliche Kinder im Bildrahmen (z. B. Maßketten) */
  children?: React.ReactNode;
  objectPosition?: string;
};

export function Figure({
  image,
  sizes,
  className = "",
  frameClassName = "",
  imgClassName = "",
  reveal = "up",
  grain = true,
  preload = false,
  caption,
  aspect,
  cap = true,
  children,
  objectPosition,
}: Props) {
  const ratio = aspect ?? `${image.width} / ${image.height}`;
  return (
    <figure className={`relative ${className}`} style={cap ? { maxWidth: image.width } : undefined}>
      <div className="relative">
        <div
          data-clip={reveal || undefined}
          className={`relative overflow-hidden bg-paper-2 ${grain ? "grain" : ""} ${frameClassName}`}
          style={{ aspectRatio: ratio }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            preload={preload}
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            quality={85}
            className={`object-cover ${imgClassName}`}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
        {children}
      </div>
      {caption && <figcaption className="mono mt-3 text-[0.8125rem] text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}
