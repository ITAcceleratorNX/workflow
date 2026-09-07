import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { INPUT_BASE, INPUT_HEIGHT, LABEL_BASE, borderFor } from "./fieldStyles"

interface FieldProps {
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  hint?: string
  className?: string
}

/** Обёртка поля: подпись, признак обязательности, подсказка и текст ошибки. */
export function Field({ label, children, required, error, hint, className }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className={LABEL_BASE}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[12px] font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[12px] text-ink-soft">{hint}</span>
      ) : null}
    </label>
  )
}

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  type?: "text" | "email" | "tel" | "date" | "time"
  disabled?: boolean
}

export function TextInput({ value, onChange, placeholder, invalid, type = "text", disabled }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      onChange={(event) => onChange(event.target.value)}
      className={cn(INPUT_BASE, INPUT_HEIGHT, borderFor(invalid))}
    />
  )
}

interface NumberInputProps {
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  invalid?: boolean
  suffix?: string
  step?: string
}

/** Пустая строка означает «значение не указано», а не ноль. */
export function NumberInput({ value, onChange, placeholder, invalid, suffix, step }: NumberInputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        step={step ?? "any"}
        inputMode="decimal"
        value={value === null || value === undefined ? "" : String(value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const raw = event.target.value
          onChange(raw === "" ? null : Number(raw))
        }}
        className={cn(INPUT_BASE, INPUT_HEIGHT, borderFor(invalid), suffix && "pr-12")}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-ink-soft">
          {suffix}
        </span>
      )}
    </div>
  )
}

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  invalid?: boolean
  readOnly?: boolean
}

export function TextArea({ value, onChange, rows = 3, placeholder, invalid, readOnly }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        INPUT_BASE,
        "py-2 leading-relaxed",
        borderFor(invalid),
        readOnly && "bg-brand-50/60 text-ink-muted"
      )}
    />
  )
}

interface SelectInputProps {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  invalid?: boolean
}

export function SelectInput({ value, onChange, options, placeholder = "Не выбрано", invalid }: SelectInputProps) {
  return (
    <select
      value={value}
      aria-invalid={invalid || undefined}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        INPUT_BASE,
        INPUT_HEIGHT,
        borderFor(invalid),
        "cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%238AA0B2%22><path d=%22M5.5 7.5 10 12l4.5-4.5z%22/></svg>')] bg-[right_0.6rem_center] bg-no-repeat pr-9",
        !value && "text-ink-soft"
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option} className="text-ink">
          {option}
        </option>
      ))}
    </select>
  )
}

interface ChipsInputProps {
  value: readonly string[]
  onChange: (value: string[]) => void
  options: readonly string[]
}

/** Мультивыбор требований к помещению (раздел 7 ТЗ) — заметнее и быстрее списка с Ctrl. */
export function ChipsInput({ value, onChange, options }: ChipsInputProps) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-brand-200 bg-white text-ink-muted hover:border-brand-400 hover:text-ink"
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

/**
 * То же оформление, что у Field, но без <label>: для мультивыбора и значений
 * только для чтения, где подпись не должна перехватывать клик по кнопке.
 */
export function FieldBlock({ label, children, required, error, hint, className }: FieldProps) {
  return (
    <div className={cn("block", className)}>
      <span className={LABEL_BASE}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[12px] font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[12px] text-ink-soft">{hint}</span>
      ) : null}
    </div>
  )
}
