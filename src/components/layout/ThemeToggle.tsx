"use client";

import { setColorMode, useDarkMode } from "@/lib/color-mode/preference";

export function ThemeToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const dark = useDarkMode();
  return (
    <button
      type="button"
      role="switch"
      aria-label="Dunkelmodus"
      aria-checked={dark}
      title={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      onClick={() => setColorMode(dark ? "light" : "dark")}
      className={`theme-toggle press ${compact ? "theme-toggle-compact" : "theme-toggle-labelled"} ${className}`}
    >
      {compact ? (
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></> : <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />}
        </svg>
      ) : (
        <>
          <span aria-hidden className="theme-switch-track"><span className="theme-switch-thumb" /></span>
          <span>Dunkelmodus</span>
        </>
      )}
    </button>
  );
}
