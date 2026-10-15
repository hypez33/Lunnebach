import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  arrow?: boolean;
  className?: string;
  onDark?: boolean;
};

export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <svg className="btn-arrow shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      {external ? (
        <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M1 8h13M9.5 3.5 14 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export function ButtonLink({ href, children, variant = "primary", external, arrow = true, className = "", onDark }: Props) {
  const cls = `btn btn-${variant} ${onDark ? "on-dark" : ""} ${className}`;
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {arrow && <Arrow external={external} />}
      {external && <span className="sr-only">(öffnet in neuem Tab)</span>}
    </>
  );
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
