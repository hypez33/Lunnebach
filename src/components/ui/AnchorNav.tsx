import type { Service } from "@/content/types";

/** Sprungmarken zu den Leistungsbereichen */
export function AnchorNav({ items, label }: { items: Service[]; label: string }) {
  return (
    <nav aria-label={label}>
      <p className="eyebrow mb-3 text-ink-muted">Bereiche</p>
      <ol className="border-t border-line">
        {items.map((s, i) => (
          <li key={s.id} className="border-b border-line">
            <a href={`#${s.id}`} className="group flex min-h-11 items-center justify-between gap-4 py-2">
              <span className="link-line">{s.title}</span>
              <span className="mono text-xs text-ink-muted" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
