"use client";

import { useSyncExternalStore } from "react";

import { MOTION_STORAGE_KEY } from "./constants";

export { MOTION_STORAGE_KEY };
const EVENT = "lb:motionchange";
const QUERY = "(prefers-reduced-motion: reduce)";

export function isUserReduced(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.motion === "reduced";
}

export function isSystemReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/** Bewegung insgesamt reduziert? (System ODER eigener Schalter) */
export function isMotionReduced(): boolean {
  return isUserReduced() || isSystemReduced();
}

export function setUserReduced(reduced: boolean) {
  const html = document.documentElement;
  if (reduced) html.dataset.motion = "reduced";
  else delete html.dataset.motion;
  try {
    if (reduced) localStorage.setItem(MOTION_STORAGE_KEY, "reduced");
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    /* privater Modus o. Ä. – Einstellung gilt dann nur für diese Sitzung */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Snapshot als Zahl kodiert, damit useSyncExternalStore stabile Werte vergleicht */
function snapshot() {
  return (isUserReduced() ? 1 : 0) | (isSystemReduced() ? 2 : 0);
}

export function useMotionPreference() {
  const s = useSyncExternalStore(subscribe, snapshot, () => 0);
  const userReduced = (s & 1) === 1;
  const systemReduced = (s & 2) === 2;
  return { userReduced, systemReduced, reduced: userReduced || systemReduced };
}

/** Signalisiert dem Failsafe-Skript im <head>, dass Motion initialisiert wurde. */
export function markMotionReady() {
  document.documentElement.classList.add("motion-ready");
}
