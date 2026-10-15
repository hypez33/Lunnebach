type Props = { children: React.ReactNode; number?: string; className?: string; as?: "p" | "span" | "div" | "h2"; id?: string };

/** Eyebrow in Mono-Versalien, optional mit Nummerierung „01 —“ */
export function Eyebrow({ children, number, className = "", as: Tag = "p", id }: Props) {
  return (
    <Tag id={id} className={`eyebrow flex items-center gap-3 ${className}`}>
      {number && (
        <span className="tabular-nums">
          {number} <span aria-hidden>—</span>
        </span>
      )}
      <span>{children}</span>
    </Tag>
  );
}
