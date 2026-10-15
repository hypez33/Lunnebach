/**
 * Maßkette im Stil technischer Zeichnungen: Maßlinie, Endstriche (45°-Schrägstrich + Hilfslinie)
 * und Label in IBM Plex Mono. Rein dekorativ (aria-hidden).
 *
 * Die Maßlinie liegt in einem gestreckten SVG (preserveAspectRatio="none"): bei horizontaler Linie
 * bleibt die Strichstärke exakt, die Länge passt sich dem Container an – DrawSVG misst in
 * Nutzereinheiten und funktioniert ohne Neuberechnung bei Resize.
 * Animation: PageMotion ([data-dimension]); `animate={false}` → statisch (z. B. Hover-Maßkette).
 */
type Props = {
  label: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  animate?: boolean;
  /** Label-Seite: horizontal oben/unten, vertikal links/rechts */
  side?: "start" | "end";
};

function Tick({ className }: { className: string }) {
  return (
    <svg className={`dim-tick ${className}`} viewBox="0 0 14 14" focusable="false">
      <path d="M7 0V14M2.5 11.5 11.5 2.5" />
    </svg>
  );
}

export function Dimension({ label, orientation = "horizontal", className = "", animate = true, side = "start" }: Props) {
  const v = orientation === "vertical";
  return (
    <div
      aria-hidden="true"
      data-dimension={animate ? "" : "static"}
      data-orientation={orientation}
      data-side={side}
      className={`dim ${v ? "dim-v" : "dim-h"} ${className}`}
    >
      <svg className="dim-line" viewBox={v ? "0 0 14 1000" : "0 0 1000 14"} preserveAspectRatio="none" focusable="false">
        <path className="dim-path" d={v ? "M7 0V1000" : "M0 7H1000"} />
      </svg>
      <Tick className="dim-tick-start" />
      <Tick className="dim-tick-end" />
      <span className="dim-label">{label}</span>
    </div>
  );
}
