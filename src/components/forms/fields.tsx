"use client";

import { useId, useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FieldError,
  Input,
  Label,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  TextField,
} from "react-aria-components";

/** Sichtbare Pflichtfeld-Kennzeichnung (nicht nur per Farbe) */
export function RequiredMark() {
  return (
    <>
      <span aria-hidden className="ml-1 text-accent-text">
        *
      </span>
      <span className="sr-only"> (Pflichtfeld)</span>
    </>
  );
}

const labelCls = "mb-2 block font-medium";
const errorCls = "mt-2 flex gap-2 text-[0.9375rem] font-medium text-error before:content-['!'] before:font-mono";
const descCls = "mt-2 block text-[0.9375rem] text-ink-muted";

type TextProps = {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  description?: string;
  multiline?: boolean;
  inputMode?: "text" | "email" | "tel" | "numeric";
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
};

export function TextInput({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  autoComplete,
  description,
  multiline,
  inputMode,
  inputRef,
}: TextProps) {
  return (
    <TextField
      name={name}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={!!error}
      isRequired={required}
      validationBehavior="aria"
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className="flex flex-col"
    >
      <Label className={labelCls}>
        {label}
        {required && <RequiredMark />}
      </Label>
      {multiline ? (
        <TextArea ref={inputRef as React.Ref<HTMLTextAreaElement>} className="field-input" rows={5} />
      ) : (
        <Input ref={inputRef as React.Ref<HTMLInputElement>} className="field-input" />
      )}
      {description && (
        <Text slot="description" className={descCls}>
          {description}
        </Text>
      )}
      <FieldError className={errorCls}>{error}</FieldError>
    </TextField>
  );
}

type Option = { value: string; title: string; text?: string; meta?: string };

/** Große Auswahlkarten (RadioGroup) */
export function ChoiceCards({
  label,
  value,
  onChange,
  options,
  error,
  required,
  columns = 2,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  columns?: 2 | 4;
}) {
  return (
    <RadioGroup
      value={value ?? null}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={required}
      validationBehavior="aria"
      className="flex flex-col"
    >
      <Label className={labelCls}>
        {label}
        {required && <RequiredMark />}
      </Label>
      <div className={`grid gap-3 ${columns === 4 ? "sm:grid-cols-2" : "md:grid-cols-2"}`}>
        {options.map((o) => (
          <Radio
            key={o.value}
            value={o.value}
            className="group relative flex min-h-[7.5rem] cursor-pointer flex-col justify-between gap-6 rounded-[2px] border-[1.5px] border-ink-muted bg-paper p-5 transition-colors data-[hovered]:border-ink data-[selected]:border-ink data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-3 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="mono text-[0.75rem] uppercase tracking-[0.1em] opacity-80">{o.meta}</span>
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-accent opacity-0 transition-opacity group-data-[selected]:opacity-100" />
              </span>
            </span>
            <span>
              <span className="block font-display text-[1.75rem] leading-tight">{o.title}</span>
              {o.text && <span className="mt-1 block text-[0.9375rem] opacity-80">{o.text}</span>}
            </span>
          </Radio>
        ))}
      </div>
      <FieldError className={errorCls}>{error}</FieldError>
    </RadioGroup>
  );
}

/** Kompakte Optionsliste (RadioGroup) */
export function RadioList({
  label,
  value,
  onChange,
  options,
  error,
  required,
  description,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
  description?: string;
}) {
  return (
    <RadioGroup
      value={value ?? null}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={required}
      validationBehavior="aria"
      className="flex flex-col"
    >
      <Label className={labelCls}>
        {label}
        {required && <RequiredMark />}
      </Label>
      {description && (
        <Text slot="description" className={`${descCls} !mt-0 mb-3`}>
          {description}
        </Text>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Radio
            key={o}
            value={o}
            className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-[2px] border-[1.5px] border-ink-muted bg-paper px-4 transition-colors data-[hovered]:border-ink data-[selected]:border-ink data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-3 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
          >
            {o}
          </Radio>
        ))}
      </div>
      <FieldError className={errorCls}>{error}</FieldError>
    </RadioGroup>
  );
}

/** Mehrfachauswahl als Chips (CheckboxGroup) */
export function CheckboxChips({
  label,
  value,
  onChange,
  options,
  error,
  required,
  description,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
  description?: string;
}) {
  return (
    <CheckboxGroup
      value={value ?? []}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={required}
      validationBehavior="aria"
      className="flex flex-col"
    >
      <Label className={labelCls}>
        {label}
        {required && <RequiredMark />}
      </Label>
      {description && (
        <Text slot="description" className={`${descCls} !mt-0 mb-3`}>
          {description}
        </Text>
      )}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => (
          <Checkbox
            key={o}
            value={o}
            className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-[2px] border-[1.5px] border-ink-muted bg-paper px-4 py-2 transition-colors data-[hovered]:border-ink data-[selected]:border-ink data-[focus-visible]:outline-3 data-[focus-visible]:outline-offset-3 data-[focus-visible]:outline-solid data-[focus-visible]:[outline-color:var(--focus-color)]"
          >
            <span
              aria-hidden
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] border-ink group-data-[selected]:bg-ink"
            >
              <svg viewBox="0 0 12 10" className="h-2.5 w-3 text-paper opacity-0 group-data-[selected]:opacity-100">
                <path d="M1 5l3.5 3.5L11 1" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            {o}
          </Checkbox>
        ))}
      </div>
      <FieldError className={errorCls}>{error}</FieldError>
    </CheckboxGroup>
  );
}

/** Datei-Upload (Demo: nur clientseitig angezeigt, nichts wird übertragen) */
export function FileField({
  label,
  description,
  multiple = true,
  accept = "image/*,.pdf",
  onFilesChange,
}: {
  label: string;
  description: string;
  multiple?: boolean;
  accept?: string;
  onFilesChange?: (names: string[]) => void;
}) {
  const id = useId();
  const [files, setFiles] = useState<File[]>([]);
  const update = (list: File[]) => {
    setFiles(list);
    onFilesChange?.(list.map((f) => f.name));
  };
  const fmt = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1).replace(".", ",")} MB` : `${Math.round(b / 1e3)} KB`);

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelCls}>
        {label} <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        aria-describedby={`${id}-desc`}
        onChange={(e) => update(Array.from(e.target.files ?? []))}
        className="field-input cursor-pointer file:mr-4 file:cursor-pointer file:rounded-[2px] file:border-[1.5px] file:border-ink file:bg-paper-2 file:px-3 file:py-1.5 file:font-medium file:text-ink"
      />
      <p id={`${id}-desc`} className={descCls}>
        {description}
      </p>
      {files.length > 0 && (
        <ul className="mt-3 grid gap-1" aria-label="Ausgewählte Dateien">
          {files.map((f) => (
            <li key={f.name + f.size} className="mono flex justify-between gap-4 border-b border-line py-2 text-[0.8125rem]">
              <span className="truncate">{f.name}</span>
              <span className="shrink-0 text-ink-muted">{fmt(f.size)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Honeypot – für Menschen unsichtbar und nicht fokussierbar */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website (bitte leer lassen)
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
