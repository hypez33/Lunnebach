"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/content/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Header: blendet beim Runterscrollen aus, beim Hochscrollen ein (nie, solange der Fokus darin liegt).
 * Ton (hell/dunkel) richtet sich nach der Sektion unter dem Header ([data-theme="dark"]).
 * Mobil: Lese-Fortschritt als 2-px-Anrisslinie direkt unter dem Header – blendet der Header aus,
 * bleibt sie am oberen Rand stehen. Scrollwerte werden auf [0, max] begrenzt, damit das Zurückfedern
 * (iOS-Overscroll) an Seitenanfang und -ende kein Ein-/Ausblenden auslöst.
 */
export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampY = () => Math.min(Math.max(window.scrollY, 0), maxScroll());
    let lastY = clampY();
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = clampY();
      const max = maxScroll();
      if (progress.current) progress.current.style.transform = `scaleX(${max ? (y / max).toFixed(4) : 0})`;
      const header = ref.current;
      if (!header) return;
      const focusInside = header.contains(document.activeElement);
      const delta = y - lastY;
      if (y < 120 || focusInside) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY = y;
      setScrolled(y > 8);

      // Sektion unter der Header-Mitte bestimmen
      const probeY = header.offsetHeight / 2;
      const stack = document.elementsFromPoint(window.innerWidth / 2, probeY);
      const under = stack.find((el) => !header.contains(el));
      const themed = under?.closest<HTMLElement>("[data-theme]");
      setDark(themed?.dataset.theme === "dark");
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onFocusIn = () => setHidden(false);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    ref.current?.addEventListener("focusin", onFocusIn);
    const headerEl = ref.current;
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      headerEl?.removeEventListener("focusin", onFocusIn);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      data-theme={dark ? "dark" : "light"}
      data-hidden={hidden || undefined}
      data-scrolled={scrolled || undefined}
      className="site-header fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-lunnebach)] data-[hidden]:-translate-y-full"
    >
      <span ref={progress} aria-hidden className="read-progress pointer-events-none absolute inset-x-0 top-full h-[2px] origin-left bg-accent lg:hidden" />
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Link href="/" className="-my-2 flex min-h-11 items-center py-2" aria-label="Lunnebach – zur Startseite">
          <Logo className="h-8 sm:h-9" />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="nav-link group relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium"
                  >
                    <span className="link-line pb-0.5 group-aria-[current=page]:bg-[length:100%_1.5px]">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/anfrage" className="btn btn-primary hidden !min-h-11 !px-4 !py-2 text-[0.9375rem] sm:inline-flex">
            <span className="btn-label">Projekt anfragen</span>
          </Link>
          <a
            href={site.phone.href}
            className="press inline-flex h-11 w-11 items-center justify-center rounded-[2px] border-[1.5px] border-current transition-[scale,opacity] duration-150 lg:hidden"
            aria-label={`Anrufen: ${site.phone.display}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1 1 0 0 1-1 1C10.7 20 4 13.3 4 5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
