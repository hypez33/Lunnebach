import { z } from "zod";

/** Optionen der geführten Projektanfrage – abhängig von Privat/Gewerbe */
export const projectTypes = {
  privat: ["Küche", "Wohnen & Schlafen", "Einbaumöbel & Stauraum", "Bad", "Outdoor", "Etwas anderes"],
  gewerbe: ["Ladenbau", "Praxis & Apotheke", "Büro", "Hotel & Gastronomie", "Freizeitanlage", "Etwas anderes"],
} as const;

export const timeframes = ["So bald wie möglich", "In den nächsten 3 Monaten", "In 3 bis 6 Monaten", "Später / noch offen"] as const;

export const budgets = ["Bis 10.000 €", "10.000 – 25.000 €", "25.000 – 50.000 €", "Über 50.000 €", "Weiß ich noch nicht"] as const;

const required = (msg: string) => z.string({ error: msg }).trim().min(1, { error: msg });

export const inquiryStepSchemas = [
  z.object({
    world: z.enum(["privat", "gewerbe"], { error: "Bitte wählen Sie, ob es um Ihr Zuhause oder Ihr Unternehmen geht." }),
  }),
  z.object({
    types: z.array(z.string()).min(1, { error: "Bitte wählen Sie mindestens eine Projektart." }),
    description: z
      .string()
      .trim()
      .min(10, { error: "Bitte beschreiben Sie Ihr Vorhaben in ein paar Worten (mindestens 10 Zeichen)." })
      .max(2000, { error: "Bitte fassen Sie sich etwas kürzer (höchstens 2000 Zeichen)." }),
  }),
  z.object({
    timeframe: z.enum(timeframes, { error: "Bitte wählen Sie einen Zeitraum." }),
    budget: z.enum(budgets).optional(),
  }),
  z.object({
    name: required("Bitte geben Sie Ihren Namen an."),
    email: z.email({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an, z. B. name@beispiel.de." }),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d\s()/-]*$/, { error: "Bitte nur Ziffern, Leerzeichen und + ( ) / - verwenden." })
      .optional()
      .or(z.literal("")),
    location: z.string().trim().max(120).optional().or(z.literal("")),
    contactPreference: z.enum(["E-Mail", "Telefon"]).optional(),
  }),
] as const;

export const inquirySchema = inquiryStepSchemas[0]
  .extend(inquiryStepSchemas[1].shape)
  .extend(inquiryStepSchemas[2].shape)
  .extend(inquiryStepSchemas[3].shape)
  .extend({
    /** Honeypot – muss leer bleiben */
    website: z.string().max(0).optional().or(z.literal("")),
    /** Nur Dateinamen – Upload ist in der Demo rein clientseitig */
    fileNames: z.array(z.string()).max(10).optional(),
  });

export type InquiryValues = z.infer<typeof inquirySchema>;

export const inquiryStepFields: (keyof InquiryValues)[][] = [
  ["world"],
  ["types", "description"],
  ["timeframe", "budget"],
  ["name", "email", "phone", "location", "contactPreference"],
];
