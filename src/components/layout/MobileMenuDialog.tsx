"use client";

import Link from "next/link";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { mainNav, site } from "@/content/site";
import { MotionToggle } from "./MotionToggle";

/**
 * Vollbild-Menü als React-Aria-Dialog: Fokus wird gefangen, Escape schließt,
 * Fokus kehrt zum Auslöser zurück. Wird erst beim ersten Öffnen geladen (siehe MobileMenu).
 */
export default function MobileMenuDialog({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  return (
    <ModalOverlay isOpen={open} onOpenChange={onOpenChange} isDismissable className="fixed inset-0 z-[60] bg-ink/40">
      <Modal className="fixed inset-0 overflow-y-auto">
        <Dialog data-theme="dark" className="theme-dark flex min-h-full flex-col outline-none" aria-labelledby="mobile-menu-title">
          {({ close }) => (
            <>
              <div className="container-site flex h-[var(--header-h)] items-center justify-between">
                <Heading slot="title" id="mobile-menu-title" className="eyebrow !font-mono text-paper-muted">
                  Menü
                </Heading>
                <Button
                  onPress={close}
                  className="inline-flex h-11 items-center gap-2 rounded-[2px] border-[1.5px] border-paper px-3 text-[0.9375rem] font-medium"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Schließen
                </Button>
              </div>

              <nav aria-label="Hauptnavigation (mobil)" className="container-site flex-1 pt-6">
                <ul className="border-t border-line-dark">
                  {mainNav.map((item, i) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href} className="border-b border-line-dark">
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className="group flex min-h-16 items-baseline justify-between gap-4 py-4"
                        >
                          <span className="font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-none tracking-tight group-aria-[current=page]:text-accent">
                            {item.label}
                          </span>
                          <span className="mono text-xs text-paper-muted">
                            {String(i + 1).padStart(2, "0")} — {item.description}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="container-site flex flex-col gap-6 pb-10 pt-10">
                <Link href="/anfrage" onClick={close} className="btn btn-primary w-full">
                  <span className="btn-label">Projekt anfragen</span>
                </Link>
                <div className="grid gap-1">
                  <a href={site.phone.href} className="inline-flex min-h-11 items-center text-paper">
                    {site.phone.display}
                  </a>
                  <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center text-paper">
                    {site.email}
                  </a>
                </div>
                <MotionToggle tone="dark" />
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
