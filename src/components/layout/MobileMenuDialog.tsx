"use client";

import Link from "next/link";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { mainNav, site } from "@/content/site";
import { EASE } from "@/lib/motion/eases";
import { gsap } from "@/lib/motion/gsap";
import { isMotionReduced } from "@/lib/motion/preference";
import { MotionToggle } from "./MotionToggle";
import { ThemeToggle } from "./ThemeToggle";

const finished = (anim: gsap.core.Animation) => new Promise<void>((resolve) => void anim.then(() => resolve()));
/** lunnebach-Ease ist registriert, sobald die Plugins geladen sind – bis dahin ein ähnlicher Standard */
const doorEase = () => (gsap.parseEase(EASE.lunnebach) ? EASE.lunnebach : "power3.inOut");

/** Öffnen: Schiebetür von rechts (clip-path), Menüpunkte zeilenweise, Anriss unter dem aktiven Punkt */
function enter(el: HTMLElement) {
  const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
  if (isMotionReduced()) return finished(gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 }));
  const tl = gsap.timeline();
  tl.fromTo(el, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: doorEase(), clearProps: "clipPath" }, 0)
    .from(q("[data-menu-line]"), { yPercent: 110, duration: 0.6, stagger: 0.05, ease: EASE.reveal }, 0.16)
    .from(q("[data-menu-meta]"), { opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 0.24);
  tl.from(q("[data-menu-anriss]"), { scaleX: 0, duration: 0.6, ease: doorEase() }, 0.5).from(
    q("[data-menu-foot]"),
    { y: 12, opacity: 0, duration: 0.45, stagger: 0.06, ease: EASE.out },
    0.36,
  );
  return finished(tl);
}

/** Schließen: rückwärts und schneller */
function exit(el: HTMLElement) {
  if (isMotionReduced()) return finished(gsap.to(el, { opacity: 0, duration: 0.15 }));
  const tl = gsap.timeline();
  tl.to(el.querySelectorAll("[data-menu-line]"), { yPercent: -60, opacity: 0, duration: 0.2, stagger: 0.02, ease: "power2.in" }, 0).fromTo(
    el,
    { clipPath: "inset(0% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 100%)", duration: 0.32, ease: "power3.in" },
    0.06,
  );
  return finished(tl);
}

/**
 * Vollbild-Menü als React-Aria-Dialog: Fokus wird gefangen, Escape schließt,
 * Fokus kehrt zum Auslöser zurück. Wird erst beim ersten Öffnen geladen (siehe MobileMenu).
 * Übergänge über onEnter/onExit von ModalOverlay – React Aria wartet auf die Animation, bevor es
 * den Dialog entfernt; Fokusverwaltung und Escape bleiben unverändert.
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
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      onEnter={enter}
      onExit={exit}
      isDismissable
      className="mobile-menu-overlay fixed inset-0 z-[60]"
    >
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
                  className="press inline-flex h-11 items-center gap-2 rounded-[2px] border-[1.5px] border-paper px-3 text-[0.9375rem] font-medium transition-[scale,opacity] duration-150"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Schließen
                </Button>
              </div>

              <nav aria-label="Hauptnavigation (mobil)" className="container-site flex-1 pt-6">
                <ul className="border-t border-line-dark">
                  {mainNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href} className="relative border-b border-line-dark">
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className="press group flex min-h-16 items-baseline justify-between gap-4 py-4 transition-[scale,opacity] duration-150 [--press-scale:0.98]"
                        >
                          <span className="block overflow-hidden pb-[0.08em]">
                            <span
                              data-menu-line
                              className="block font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-none tracking-tight group-aria-[current=page]:text-accent"
                            >
                              {item.label}
                            </span>
                          </span>
                          <span data-menu-meta className="mono text-xs text-paper-muted">
                            {item.description}
                          </span>
                        </Link>
                        {active && <span data-menu-anriss aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent" />}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="container-site flex flex-col gap-6 pb-10 pt-10">
                {/* Wrapper animieren, nicht .btn selbst (dessen opacity-Transition würde den Tween bremsen) */}
                <div data-menu-foot>
                  <Link href="/anfrage" onClick={close} className="btn btn-primary w-full">
                    <span className="btn-label">Projekt anfragen</span>
                  </Link>
                </div>
                <div data-menu-foot className="grid gap-1">
                  <a href={site.phone.href} className="inline-flex min-h-11 items-center text-paper">
                    {site.phone.display}
                  </a>
                  <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center text-paper">
                    {site.email}
                  </a>
                </div>
                <div data-menu-foot className="flex flex-wrap gap-x-6 gap-y-3">
                  <ThemeToggle />
                  <MotionToggle tone="dark" />
                </div>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
