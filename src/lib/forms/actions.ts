"use server";

import { z } from "zod";
import { applicationSchema } from "./application";
import { inquirySchema } from "./inquiry";

export type ActionResult =
  | { ok: true; message: string; firstName?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * Demo: validiert serverseitig, loggt und bestätigt. Kein Versand, keine Speicherung.
 * Später: E-Mail-Versand / Payload-Collection „inquiries“.
 */
export async function submitInquiry(input: unknown): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Bitte prüfen Sie Ihre Angaben.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }
  // Honeypot gefüllt → still „erfolgreich“ antworten, aber nichts tun
  if (parsed.data.website) return { ok: true, message: "Danke." };

  const { name, email, world, types, timeframe } = parsed.data;
  console.info("[Anfrage]", { name, email, world, types, timeframe, at: new Date().toISOString() });
  return {
    ok: true,
    message: "Vielen Dank – Ihre Anfrage ist bei uns angekommen.",
    firstName: name.split(/\s+/)[0],
  };
}

export async function submitApplication(input: unknown): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Bitte prüfe deine Angaben.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }
  if (parsed.data.website) return { ok: true, message: "Danke." };
  console.info("[Bewerbung]", { name: parsed.data.name, position: parsed.data.position, at: new Date().toISOString() });
  return {
    ok: true,
    message: `Danke, ${parsed.data.name.split(/\s+/)[0]}! Deine Bewerbung ist angekommen. Wir melden uns persönlich bei dir.`,
  };
}
