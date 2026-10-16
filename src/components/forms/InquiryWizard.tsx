"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "react-aria-components";
import { site } from "@/content/site";
import { submitInquiry } from "@/lib/forms/actions";
import { INQUIRY_STORAGE_KEY } from "@/lib/forms/constants";
import { gsap } from "@/lib/motion/gsap";
import { isMotionReduced } from "@/lib/motion/preference";
import { budgets, inquirySchema, inquiryStepFields, projectTypes, timeframes, type InquiryValues } from "@/lib/forms/inquiry";
import { CheckboxChips, ChoiceCards, FileField, Honeypot, RadioList, TextInput } from "./fields";

const STEPS = [
  { short: "Art", title: "Worum geht es?" },
  { short: "Projekt", title: "Was dürfen wir für Sie bauen?" },
  { short: "Zeitraum", title: "Wann soll es losgehen?" },
  { short: "Kontakt", title: "Wie erreichen wir Sie?" },
] as const;


const FIELD_LABELS: Partial<Record<keyof InquiryValues, string>> = {
  world: "Art des Projekts",
  types: "Projektart",
  description: "Beschreibung",
  timeframe: "Zeitraum",
  name: "Name",
  email: "E-Mail",
  phone: "Telefon",
};

/**
 * Geführte Projektanfrage in 4 Schritten.
 * - Fortschritt „Schritt 2 von 4“, Zurück jederzeit, Eingaben bleiben erhalten
 * - Fehler inline im Klartext + Zusammenfassung per aria-live
 * - Fokus springt beim Schrittwechsel auf die neue Schrittüberschrift
 * - kein Zeitlimit, Honeypot gegen Spam, Absenden über Server Action
 * - Motion: neuer Schritt gleitet herein (vorwärts von rechts, zurück von links), Fortschritt füllt sich,
 *   Auswahlkarten mit Press-State und Haken, der sich zeichnet. Reduziert: sofortiger Wechsel.
 */
export function InquiryWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const stepRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(0);

  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    getFieldState,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      types: [],
      description: "",
      name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      fileNames: [],
    },
  });

  const world = useWatch({ control, name: "world" });

  // Schrittwechsel: aus der Laufrichtung hereingleiten (vor dem Paint, kein Aufblitzen)
  useLayoutEffect(() => {
    const dir = Math.sign(step - prevStep.current);
    prevStep.current = step;
    const el = stepRef.current;
    if (!dir || !el || isMotionReduced()) return;
    const tween = gsap.fromTo(
      el,
      { x: dir * Math.min(64, window.innerWidth * 0.12), opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out", clearProps: "transform,opacity" },
    );
    return () => {
      tween.kill();
    };
  }, [step]);

  // Fokus auf neue Schrittüberschrift (nicht beim ersten Rendern)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const announceErrors = (fields: (keyof InquiryValues)[]) => {
    const names = fields.map((f) => FIELD_LABELS[f] ?? f);
    setAnnouncement(
      names.length === 1
        ? `Bitte prüfen Sie das Feld „${names[0]}“.`
        : `Bitte prüfen Sie ${names.length} Felder: ${names.join(", ")}.`,
    );
  };

  const next = async () => {
    const fields = inquiryStepFields[step];
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) {
      const invalid = fields.filter((f) => getFieldState(f).invalid);
      announceErrors(invalid.length ? invalid : fields.slice(0, 1));
      return;
    }
    setAnnouncement("");
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setAnnouncement("");
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = (values: InquiryValues) => {
    setServerError("");
    startTransition(async () => {
      const result = await submitInquiry(values);
      if (result.ok) {
        try {
          sessionStorage.setItem(INQUIRY_STORAGE_KEY, result.firstName ?? "");
        } catch {
          /* ohne sessionStorage: Bestätigung ohne Namen */
        }
        router.push("/anfrage/danke");
      } else {
        setServerError(result.message);
        setAnnouncement(result.message);
      }
    });
  };

  const onInvalid = (errs: Partial<Record<keyof InquiryValues, unknown>>) => {
    const keys = Object.keys(errs) as (keyof InquiryValues)[];
    // Zu dem ersten Schritt mit Fehler springen
    const target = inquiryStepFields.findIndex((fs) => fs.some((f) => keys.includes(f)));
    if (target !== -1 && target !== step) setStep(target);
    announceErrors(keys);
  };

  const s = STEPS[step];
  const err = (k: keyof InquiryValues) => (errors[k]?.message as string | undefined) ?? undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative" aria-labelledby="wizard-title">
      <h2 id="wizard-title" className="sr-only">
        Projektanfrage
      </h2>

      {/* Fortschritt */}
      <ol aria-label="Fortschritt" className="grid grid-cols-4 gap-2">
        {STEPS.map((st, i) => (
          <li key={st.short} aria-current={i === step ? "step" : undefined} className="flex flex-col gap-2">
            <span aria-hidden className="relative h-1.5 overflow-hidden rounded-[1px] bg-line-strong">
              <span
                className={`absolute inset-0 origin-left bg-accent transition-transform duration-500 ease-[var(--ease-lunnebach)] ${i <= step ? "scale-x-100" : "scale-x-0"}`}
                style={{ transitionDelay: i === step ? "120ms" : "0ms" }}
              />
            </span>
            <span className={`mono text-[0.75rem] uppercase tracking-[0.08em] ${i === step ? "text-ink" : "text-ink-muted"}`}>
              <span aria-hidden>{String(i + 1).padStart(2, "0")} </span>
              <span className="hidden sm:inline">{st.short}</span>
              {i < step && <span className="sr-only"> (erledigt)</span>}
            </span>
          </li>
        ))}
      </ol>

      <div ref={stepRef} className="mt-12" role="group" aria-labelledby="step-title">
        <h3 id="step-title" ref={headingRef} tabIndex={-1} className="outline-none">
          <span className="eyebrow block text-ink-muted">
            Schritt {step + 1} von {STEPS.length}
          </span>
          <span className="mt-3 block text-h2">{s.title}</span>
        </h3>
        <p className="mt-4 text-ink-muted">
          Mit <span className="text-accent-text">*</span> markierte Felder sind Pflichtfelder.
        </p>

        <div className="mt-10 grid gap-10">
          {step === 0 && (
            <Controller
              control={control}
              name="world"
              render={({ field }) => (
                <ChoiceCards
                  label="Für wen planen wir?"
                  required
                  value={field.value}
                  onChange={(v) => {
                    if (v !== field.value) setValue("types", []);
                    field.onChange(v);
                  }}
                  error={err("world")}
                  options={[
                    { value: "privat", meta: "Privat · Wohnräume", title: "Für mein Zuhause", text: "Küche, Wohnen, Einbau, Bad, Outdoor" },
                    { value: "gewerbe", meta: "Gewerbe · Objekte", title: "Für mein Unternehmen", text: "Laden, Praxis, Büro, Hotel, Freizeit" },
                  ]}
                />
              )}
            />
          )}

          {step === 1 && (
            <>
              <Controller
                control={control}
                name="types"
                render={({ field }) => (
                  <CheckboxChips
                    label="Projektart"
                    description="Mehrfachauswahl möglich."
                    required
                    value={field.value}
                    onChange={field.onChange}
                    error={err("types")}
                    options={projectTypes[world ?? "privat"]}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextInput
                    name="description"
                    label="Kurze Beschreibung"
                    description="Raum, Wünsche, Besonderheiten – ein paar Sätze genügen."
                    required
                    multiline
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    error={err("description")}
                  />
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Controller
                control={control}
                name="timeframe"
                render={({ field }) => (
                  <RadioList label="Zeitraum" required value={field.value} onChange={field.onChange} options={timeframes} error={err("timeframe")} />
                )}
              />
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <RadioList
                    label="Budgetrahmen (optional)"
                    description="Hilft uns, passende Lösungen vorzuschlagen."
                    value={field.value}
                    onChange={field.onChange}
                    options={budgets}
                  />
                )}
              />
              <FileField
                label="Fotos oder Grundriss"
                description="JPG, PNG oder PDF. Hinweis: In dieser Demo werden Dateien nur angezeigt, nicht übertragen."
                onFilesChange={(names) => setValue("fileNames", names)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-8 md:grid-cols-2">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <TextInput
                      name="name"
                      label="Name"
                      required
                      autoComplete="name"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={err("name")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextInput
                      name="email"
                      label="E-Mail"
                      type="email"
                      inputMode="email"
                      required
                      autoComplete="email"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={err("email")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <TextInput
                      name="phone"
                      label="Telefon (optional)"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={err("phone")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <TextInput
                      name="location"
                      label="Ort des Projekts (optional)"
                      autoComplete="address-level2"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="contactPreference"
                render={({ field }) => (
                  <RadioList label="Wie dürfen wir uns melden? (optional)" value={field.value} onChange={field.onChange} options={["E-Mail", "Telefon"]} />
                )}
              />
              <div className="border-l-2 border-accent bg-paper px-5 py-4 text-[0.9375rem] text-ink-muted">
                <p>
                  <strong className="font-medium text-ink">Datenschutz:</strong> Wir verwenden Ihre Angaben ausschließlich, um Ihre
                  Anfrage zu beantworten. Keine Weitergabe an Dritte, keine Werbung. Details in der{" "}
                  <a href="/datenschutz" className="text-link">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Controller control={control} name="website" render={({ field }) => <Honeypot value={field.value ?? ""} onChange={field.onChange} />} />

      {/* Ansage für Screenreader (und sichtbar als Zusammenfassung) */}
      <div aria-live="assertive" aria-atomic="true" className="mt-8">
        {announcement && (
          <p className="flex gap-3 border-l-2 border-error bg-paper px-5 py-4 font-medium text-error">
            <span aria-hidden className="font-mono">!</span>
            {announcement}
          </p>
        )}
      </div>
      {serverError && <p className="sr-only">{serverError}</p>}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        {step > 0 ? (
          <Button type="button" onPress={back} className="btn btn-secondary">
            <span aria-hidden>←</span>
            <span className="btn-label">Zurück</span>
          </Button>
        ) : (
          <span className="text-[0.9375rem] text-ink-muted">
            Lieber telefonieren?{" "}
            <a href={site.phone.href} className="text-link">
              {site.phone.display}
            </a>
          </span>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" onPress={next} className="btn btn-primary">
            <span className="btn-label">Weiter</span>
            <span aria-hidden>→</span>
          </Button>
        ) : (
          <Button type="submit" isPending={pending} className="btn btn-primary data-[pending]:opacity-80">
            <span className="btn-label">{pending ? "Wird gesendet …" : "Anfrage senden"}</span>
            <span aria-hidden>→</span>
          </Button>
        )}
      </div>
    </form>
  );
}
