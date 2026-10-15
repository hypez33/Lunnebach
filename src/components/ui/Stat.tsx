const nf = (d: number) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Zahl, die einmalig hochzählt (PageMotion [data-count]). Screenreader lesen den Endwert. */
export function Stat({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const formatted = `${prefix}${nf(decimals).format(value)}`;
  return (
    <div className="border-t border-line-dark pt-5">
      <p className="font-display text-[clamp(3rem,2rem+3vw,5.5rem)] leading-none tracking-[-0.03em] [font-variation-settings:'opsz'_144]">
        <span aria-hidden data-count={value} data-decimals={decimals} data-prefix={prefix}>
          {formatted}
        </span>
        <span aria-hidden className="text-[0.4em] tracking-normal">
          {suffix}
        </span>
        <span className="sr-only">
          {formatted}
          {suffix}
        </span>
      </p>
      <p className="eyebrow mt-3 text-paper-muted">{label}</p>
    </div>
  );
}
