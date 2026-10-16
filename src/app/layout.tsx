import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/content/site";
import { businessJsonLd, jsonLdString } from "@/lib/jsonld";
import { MOTION_STORAGE_KEY } from "@/lib/motion/constants";
import { COLOR_MODE_STORAGE_KEY } from "@/lib/color-mode/constants";
import { fraunces, instrumentSans, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lunnebach – Tischlerei in Koblenz · Die creative Holzwerkstätte",
    template: "%s · Lunnebach Koblenz",
  },
  description: site.description,
  applicationName: "Lunnebach",
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Lunnebach – Die creative Holzwerkstätte",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

/**
 * Läuft vor dem ersten Paint: markiert JS-Verfügbarkeit (.js), übernimmt den gespeicherten
 * Motion-Schalter und setzt nach 3 s einen Failsafe, falls Motion-Code nicht startet.
 * Der leere touchstart-Listener aktiviert :active (Tap-Feedback) in iOS Safari.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var mode=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';try{if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='reduced')d.setAttribute('data-motion','reduced');var saved=localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');if(saved==='dark'||saved==='light'){mode=saved;d.dataset.colorPreference=saved}}catch(e){}d.dataset.colorMode=mode;document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=mode==='dark'?'#1c1916':'#f4f1ec'});document.addEventListener('touchstart',function(){},{passive:true});setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('motion-failsafe')},3000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${plexMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#f4f1ec" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(businessJsonLd()) }}
        />
      </body>
    </html>
  );
}
