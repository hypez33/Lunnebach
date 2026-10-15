"use client";

import { Switch } from "react-aria-components";
import { setUserReduced, useMotionPreference } from "@/lib/motion/preference";

/** Schalter „Bewegung reduzieren“ – speichert in localStorage und setzt data-motion am <html>. */
export function MotionToggle({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const { userReduced, systemReduced } = useMotionPreference();
  const onDark = tone === "dark";

  return (
    <div className="flex flex-col gap-1">
      <Switch
        isSelected={userReduced || systemReduced}
        isDisabled={systemReduced}
        onChange={(v) => setUserReduced(v)}
        className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] data-[disabled]:cursor-default"
      >
        <span
          aria-hidden
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-[1.5px] transition-colors ${
            onDark
              ? "border-paper-muted group-data-[selected]:border-accent group-data-[selected]:bg-accent"
              : "border-ink-muted group-data-[selected]:border-ink group-data-[selected]:bg-ink"
          } group-data-[focus-visible]:outline-3 group-data-[focus-visible]:outline-offset-3 group-data-[focus-visible]:[outline-color:var(--focus-color)] group-data-[focus-visible]:outline-solid`}
        >
          <span
            className={`ml-[3px] h-4 w-4 rounded-full transition-transform duration-300 group-data-[selected]:translate-x-5 ${
              onDark ? "bg-paper group-data-[selected]:bg-ink" : "bg-ink group-data-[selected]:bg-paper"
            }`}
          />
        </span>
        <span>Bewegung reduzieren</span>
      </Switch>
      {systemReduced && (
        <p className={`text-sm ${onDark ? "text-paper-muted" : "text-ink-muted"}`}>
          Ihr System bevorzugt bereits reduzierte Bewegung.
        </p>
      )}
    </div>
  );
}
