"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FieldError, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";
import { jobs } from "@/content/jobs";
import { submitApplication } from "@/lib/forms/actions";
import { applicationSchema, type ApplicationValues } from "@/lib/forms/application";
import { FileField, Honeypot, RequiredMark, TextInput } from "./fields";

const positions = [...jobs.map((j) => j.title), "Praktikum", "Initiativbewerbung"];

/**
 * Kurzbewerbung (Du-Ansprache). Bewusst ohne Geburtsdatum und ohne Pflichtfeld Schulabschluss.
 */
export function ApplicationForm() {
  const [done, setDone] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [pending, startTransition] = useTransition();
  const successRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", position: "", message: "", website: "" },
  });

  const err = (k: keyof ApplicationValues) => errors[k]?.message;

  // Nach Erfolg Fokus auf die Bestätigung
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const onSubmit = (values: ApplicationValues) =>
    startTransition(async () => {
      const result = await submitApplication(values);
      if (result.ok) {
        setDone(result.message);
        setAnnouncement("");
      } else setAnnouncement(result.message);
    });

  const onInvalid = (e: Partial<Record<keyof ApplicationValues, unknown>>) => {
    const n = Object.keys(e).length;
    setAnnouncement(n === 1 ? "Bitte prüfe das markierte Feld." : `Bitte prüfe die ${n} markierten Felder.`);
  };

  if (done) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-l-2 border-accent bg-paper p-8 outline-none">
        <p className="eyebrow text-ink-muted">Bewerbung gesendet</p>
        <p className="mt-4 font-display text-h3">{done}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} aria-label="Kurzbewerbung" className="relative grid gap-8">
      <p className="text-ink-muted">
        Mit <span className="text-accent-text">*</span> markierte Felder sind Pflichtfelder.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextInput name="name" label="Name" required autoComplete="name" value={field.value} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={err("name")} />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput name="email" label="E-Mail" type="email" inputMode="email" required autoComplete="email" value={field.value} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={err("email")} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextInput name="phone" label="Telefon (optional)" type="tel" inputMode="tel" autoComplete="tel" value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={err("phone")} />
          )}
        />
        <Controller
          control={control}
          name="position"
          render={({ field }) => (
            <Select
              selectedKey={field.value || null}
              onSelectionChange={(k) => field.onChange(String(k ?? ""))}
              onBlur={field.onBlur}
              isInvalid={!!err("position")}
              isRequired
              validationBehavior="aria"
              placeholder="Bitte wählen"
              className="flex flex-col"
            >
              <Label className="mb-2 block font-medium">
                Gewünschte Stelle
                <RequiredMark />
              </Label>
              <Button ref={field.ref} className="field-input flex items-center justify-between gap-3 text-left data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]">
                <SelectValue className="truncate data-[placeholder]:text-ink-muted" />
                <svg aria-hidden width="12" height="8" viewBox="0 0 12 8">
                  <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Button>
              <FieldError className="mt-2 flex gap-2 text-[0.9375rem] font-medium text-error before:font-mono before:content-['!']">
                {err("position")}
              </FieldError>
              <Popover className="min-w-[var(--trigger-width)] rounded-[2px] border-[1.5px] border-ink bg-paper shadow-[0_8px_24px_rgb(28_25_22/0.12)]">
                <ListBox className="max-h-80 overflow-auto p-1 outline-none">
                  {positions.map((p) => (
                    <ListBoxItem
                      key={p}
                      id={p}
                      className="flex min-h-11 cursor-pointer items-center px-3 outline-none data-[focused]:bg-paper-2 data-[selected]:font-medium data-[selected]:text-accent-text"
                    >
                      {p}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          )}
        />
      </div>
      <Controller
        control={control}
        name="message"
        render={({ field }) => (
          <TextInput
            name="message"
            label="Nachricht (optional)"
            description="Erzähl uns kurz, wer du bist und was dich an der Arbeit bei uns reizt."
            multiline
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            error={err("message")}
          />
        )}
      />
      <FileField
        label="Lebenslauf oder Zeugnisse"
        description="PDF oder Bild. Hinweis: In dieser Demo wird die Datei nur angezeigt, nicht übertragen."
        multiple={false}
        accept=".pdf,image/*"
        onFilesChange={(names) => setValue("fileName", names[0])}
      />
      <Controller control={control} name="website" render={({ field }) => <Honeypot value={field.value ?? ""} onChange={field.onChange} />} />

      <p className="text-[0.9375rem] text-ink-muted">
        Wir nutzen deine Angaben nur für deine Bewerbung und löschen sie, wenn es nicht passt. Mehr in der{" "}
        <a href="/datenschutz" className="text-link">
          Datenschutzerklärung
        </a>
        .
      </p>

      <div aria-live="assertive" aria-atomic="true">
        {announcement && (
          <p className="flex gap-3 border-l-2 border-error bg-paper px-5 py-4 font-medium text-error">
            <span aria-hidden className="font-mono">!</span>
            {announcement}
          </p>
        )}
      </div>

      <div>
        <Button type="submit" isPending={pending} className="btn btn-primary">
          <span className="btn-label">{pending ? "Wird gesendet …" : "Bewerbung senden"}</span>
          <span aria-hidden>→</span>
        </Button>
      </div>
    </form>
  );
}
