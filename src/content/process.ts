import type { ProcessStep } from "./types";

export const processHeadline = "Vom ersten Strich bis zur letzten Schraube.";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Zuhören",
    text: "Wir beginnen mit einem ausführlichen Gespräch, bei Ihnen vor Ort oder in unserer Ausstellung. Ihren Stil zu verstehen, ist der erste Arbeitsschritt.",
    image: "team/lunnebach-team2",
  },
  {
    number: "02",
    title: "Planen",
    text: "Aus Skizzen werden präzise Pläne. Wir denken Anschlüsse, Details und Abläufe mit, bevor das erste Brett zugeschnitten wird.",
    image: "gewerbe/buero/oberflaeche",
  },
  {
    number: "03",
    title: "Anpassen",
    text: "Projekte leben. Ändern sich Ideen oder Anforderungen, reagieren wir gelassen – und finden oft die bessere Lösung.",
    image: "privat/kueche/herdfeld",
  },
  {
    number: "04",
    title: "Fertigen",
    text: "Millimetergenau auf unserer CNC-Anlage, veredelt von Hand im Bankraum. Qualität, die auch nach Jahren noch überzeugt.",
    image: "team/team3",
  },
  {
    number: "05",
    title: "Montieren",
    text: "Unser eigenes Team baut sauber, schnell und passgenau bei Ihnen ein. Danach ist der Raum fertig – nicht fast fertig.",
    image: "privat/kueche/kueche-nussbaum",
  },
];
