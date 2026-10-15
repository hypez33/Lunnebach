import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().trim().min(1, { error: "Bitte gib deinen Namen an." }),
  email: z.email({ error: "Bitte gib eine gültige E-Mail-Adresse an, z. B. name@beispiel.de." }),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()/-]*$/, { error: "Bitte nur Ziffern, Leerzeichen und + ( ) / - verwenden." })
    .optional()
    .or(z.literal("")),
  position: z.string().min(1, { error: "Bitte wähle eine Stelle aus." }),
  message: z.string().trim().max(3000, { error: "Bitte höchstens 3000 Zeichen." }).optional().or(z.literal("")),
  fileName: z.string().optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;
