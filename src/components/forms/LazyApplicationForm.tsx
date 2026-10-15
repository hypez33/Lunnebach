"use client";

import dynamic from "next/dynamic";

/**
 * Das Bewerbungsformular steht weit unten auf /karriere und zieht React Aria (Select), RHF und Zod nach.
 * Es wird daher erst nach der Hydration geladen. Ohne JavaScript steht der Hinweis auf Post/E-Mail
 * daneben (ein Formular ohne JS könnte ohnehin nicht abgeschickt werden).
 */
export const LazyApplicationForm = dynamic(() => import("./ApplicationForm").then((m) => m.ApplicationForm), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="grid gap-8">
      <div className="h-5 w-64 bg-paper" />
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid gap-2">
            <div className="h-4 w-28 bg-paper" />
            <div className="h-12 border-[1.5px] border-line-strong bg-paper" />
          </div>
        ))}
      </div>
      <div className="h-36 border-[1.5px] border-line-strong bg-paper" />
    </div>
  ),
});
