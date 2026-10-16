type Props = { children: React.ReactNode; className?: string; as?: "p" | "span" | "div" | "h2"; id?: string };

/** Eyebrow in Mono-Versalien (ohne Nummerierung – Überschriften stehen für sich) */
export function Eyebrow({ children, className = "", as: Tag = "p", id }: Props) {
  return (
    <Tag id={id} className={`eyebrow flex items-center gap-3 ${className}`}>
      <span>{children}</span>
    </Tag>
  );
}
