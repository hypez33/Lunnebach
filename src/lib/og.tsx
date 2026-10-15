import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));
// Schriften und Logo einmal auf Modulebene laden (statische Generierung beim Build)
const fontsReady = Promise.all([font("Fraunces-144-Light.ttf"), font("IBMPlexMono-Medium.ttf")]);
const dataUrl = async (publicPath: string, mime: string) =>
  `data:${mime};base64,${(await readFile(join(process.cwd(), "public", publicPath))).toString("base64")}`;

/** Gemeinsames Open-Graph-Layout „Werkzeichnung“: Papiergrund, Anrisslinie, Titel in Fraunces, optional Bild. */
export async function renderOg({ eyebrow, title, image }: { eyebrow: string; title: string; image?: string }) {
  const [[fraunces, mono], logo, photo] = await Promise.all([
    fontsReady,
    dataUrl("images/brand/logo-2.png", "image/png"),
    image ? dataUrl(image, image.endsWith(".webp") ? "image/webp" : "image/jpeg") : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4F1EC",
          color: "#1C1916",
          padding: 64,
          backgroundImage:
            "linear-gradient(to right, rgba(28,25,22,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,22,0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Plex", fontSize: 20, letterSpacing: 2.4, textTransform: "uppercase", color: "#5C554D" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", height: 2, background: "#E46929", marginTop: 20, width: image ? 620 : 1072 }} />
            <div
              style={{
                display: "flex",
                fontFamily: "Fraunces",
                fontSize: image ? 76 : 96,
                lineHeight: 1.02,
                letterSpacing: -2,
                marginTop: 40,
                maxWidth: image ? 600 : 1000,
              }}
            >
              {title}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={260} height={60} alt="" />
        </div>
        {photo && (
          <div style={{ display: "flex", width: 420, marginLeft: 48, alignItems: "flex-end" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={420} height={500} alt="" style={{ objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 300 },
        { name: "Plex", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
