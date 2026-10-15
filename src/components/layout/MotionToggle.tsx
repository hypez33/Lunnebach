"use client";

import { useId } from "react";
import { setUserReduced, useMotionPreference } from "@/lib/motion/preference";

/**
 * Schalter „Bewegung reduzieren“ – speichert in localStorage und setzt data-motion am <html>.
 * Natives <button role="switch"> (ARIA-Switch-Muster), damit kein UI-Framework im kritischen Pfad liegt.
 */
export function MotionToggle({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const { userReduced, systemReduced } = useMotionPreference();
  const onDark = tone === "dark";
  const checked = userReduced || systemReduced;
  const noteId = useId();

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={systemReduced}
        aria-describedby={systemReduced ? noteId : undefined}
        onClick={() => setUserReduced(!userReduced)}
        className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-left text-[0.9375rem] disabled:cursor-default"
      >
        <span
          aria-hidden
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-[1.5px] transition-colors ${
            onDark
              ? "border-paper-muted group-aria-checked:border-accent group-aria-checked:bg-accent"
              : "border-ink-muted group-aria-checked:border-ink group-aria-checked:bg-ink"
          }`}
        >
          <span
            className={`ml-[3px] h-4 w-4 rounded-full transition-transform duration-300 group-aria-checked:translate-x-5 ${
              onDark ? "bg-paper group-aria-checked:bg-ink" : "bg-ink group-aria-checked:bg-paper"
            }`}
          />
        </span>
        <span>Bewegung reduzieren</span>
      </button>
      {systemReduced && (
        <p id={noteId} className={`text-sm ${onDark ? "text-paper-muted" : "text-ink-muted"}`}>
          Ihr System bevorzugt bereits reduzierte Bewegung.
        </p>
      )}
    </div>
  );
}
