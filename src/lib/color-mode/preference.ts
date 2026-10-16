"use client";

import { useSyncExternalStore } from "react";
import { COLOR_MODE_STORAGE_KEY } from "./constants";

type ColorMode = "light" | "dark";
const EVENT = "lb:colormodechange";
const QUERY = "(prefers-color-scheme: dark)";

function apply(mode: ColorMode) {
  document.documentElement.dataset.colorMode = mode;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = mode === "dark" ? "#1c1916" : "#f4f1ec";
  });
}

export function setColorMode(mode: ColorMode) {
  document.documentElement.dataset.colorPreference = mode;
  apply(mode);
  try {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    // Die Auswahl bleibt auch ohne verfügbaren Speicher für diese Sitzung erhalten.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  const onSystemChange = () => {
    if (document.documentElement.dataset.colorPreference) return;
    apply(media.matches ? "dark" : "light");
    callback();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== COLOR_MODE_STORAGE_KEY && event.key !== null) return;
    if (event.newValue === "dark" || event.newValue === "light") {
      document.documentElement.dataset.colorPreference = event.newValue;
      apply(event.newValue);
    } else {
      delete document.documentElement.dataset.colorPreference;
      apply(media.matches ? "dark" : "light");
    }
    callback();
  };
  apply(document.documentElement.dataset.colorPreference === "dark" ? "dark" :
    document.documentElement.dataset.colorPreference === "light" ? "light" :
      media.matches ? "dark" : "light");
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
}

const snapshot = () => document.documentElement.dataset.colorMode === "dark";
export const useDarkMode = () => useSyncExternalStore(subscribe, snapshot, () => false);
