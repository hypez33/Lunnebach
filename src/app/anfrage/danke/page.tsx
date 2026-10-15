import type { Metadata } from "next";
import { ThankYou } from "@/components/forms/ThankYou";

export const metadata: Metadata = {
  title: "Danke für Ihre Anfrage",
  robots: { index: false, follow: true },
};

export default function DankePage() {
  return <ThankYou />;
}
