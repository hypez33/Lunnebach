import { ogSize, renderOg } from "@/lib/og";

export const alt = "Lunnebach – Räume und Möbel, auf den Millimeter gedacht.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Tischlerei · Koblenz",
    title: "Räume und Möbel, auf den Millimeter gedacht.",
    image: "images/hero/moebelbau-vitrine.jpg",
  });
}
