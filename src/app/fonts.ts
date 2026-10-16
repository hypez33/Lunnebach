import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";

// Selbst gehostet über next/font (Download beim Build, kein Abruf bei Google zur Laufzeit).
// Per CSS bei Bedarf laden, statt alle Familien und Gewichte auf jeder Seite vorzuladen.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
  preload: false,
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});
