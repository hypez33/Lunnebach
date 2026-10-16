"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const loadDialog = () => import("./MobileMenuDialog");
const MobileMenuDialog = lazy(loadDialog);

/**
 * Auslöser des Mobile-Menüs. Der eigentliche Dialog (React Aria) wird erst bei Bedarf geladen –
 * vorgewärmt bei Hover/Fokus, damit das Öffnen sofort erfolgt.
 */
export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Bei Routenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        onPointerEnter={loadDialog}
        onFocus={loadDialog}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="press inline-flex h-11 items-center gap-2 rounded-[2px] border-[1.5px] border-current px-3 text-[0.9375rem] font-medium transition-[scale,opacity] duration-150 lg:hidden"
      >
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
          <path d="M0 1h18M0 6h18M0 11h12" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Menü
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <MobileMenuDialog open={open} onOpenChange={setOpen} pathname={pathname} />
        </Suspense>
      )}
    </>
  );
}
