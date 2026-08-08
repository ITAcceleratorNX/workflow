import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Check, CircleAlert, Send } from "lucide-react"
import { Button, LinkButton } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { cn } from "../../lib/utils"
import { CONTACTS, track, whatsappLink } from "../../lib/site"
import { PROPERTY_OPTIONS } from "../../lib/properties"
import {
  EMPTY_LEAD,
  PHONE_PLACEHOLDER,
  SUCCESS_MESSAGE,
  formatPhoneDigits,
  normalizePhoneDigits,
  submitLead,
  validateLead,
  type LeadFieldErrors,
  type LeadFormValues,
  type LeadSource,
} from "../../lib/leadForm"

interface LeadFormProps {
  source: LeadSource
  /** На странице объекта значение подставляется автоматически (9.2 ТЗ) */
  defaultProperty?: string
  inverted?: boolean
  onSuccess?: () => void
}

const fieldClass = (hasError: boolean, inverted: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-brand-900 outline-none transition placeholder:text-ink-soft",
    "focus:border-orange-400 focus:ring-2 focus:ring-orange-500/25",
    hasError ? "border-red-400" : inverted ? "border-transparent" : "border-brand-200"
  )

export function LeadForm({ source, defaultProperty, inverted = false, onSuccess }: LeadFormProps) {
  const uid = useId()
  /* Отметка старта заполнения — по ней отсекается мгновенная отправка ботом */
  const startedAt = useRef(0)
  const [values, setValues] = useState<LeadFormValues>({
    ...EMPTY_LEAD,
    property: defaultProperty ?? "",
  })
  const [honeypot, setHoneypot] = useState("")
  const [errors, setErrors] = useState<LeadFieldErrors>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const setField = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === "submitting") return

    const nextErrors = validateLead(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus("submitting")
    setSubmitError("")

    const result = await submitLead({
      ...values,
      source,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      website: honeypot,
      elapsedMs: Date.now() - startedAt.current,
    })

    if (result.ok) {
      setStatus("success")
      track("lead_submit", { source, property: values.property })
      onSuccess?.()
    } else {
      setStatus("error")
      setSubmitError(result.error ?? "Не удалось отправить заявку")
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl p-8 text-center",
          inverted ? "bg-white/10" : "bg-brand-50"
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white">
          <Check className="h-7 w-7" />
        </span>
        <p className={cn("max-w-md text-lg font-semibold", inverted ? "text-white" : "text-brand-900")}>
          {SUCCESS_MESSAGE}
        </p>
      </div>
    )
  }

  const labelClass = cn("mb-1.5 block text-sm font-medium", inverted ? "text-brand-100" : "text-brand-800")
  const errorClass = "mt-1.5 flex items-center gap-1.5 text-sm text-red-500"

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot: скрыт от пользователей, заполняется только ботами */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Не заполняйте это поле</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`${uid}-name`}>
            Имя <span className="text-orange-500">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            className={fieldClass(Boolean(errors.name), inverted)}
            placeholder="Как к вам обращаться"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
          />
          {errors.name && (
            <p id={`${uid}-name-error`} className={errorClass}>
              <CircleAlert className="h-4 w-4 shrink-0" /> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-company`}>
            Компания
          </label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
            className={fieldClass(false, inverted)}
            placeholder="Название компании"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-phone`}>
            Телефон <span className="text-orange-500">*</span>
          </label>
          <div
            className={cn(
              fieldClass(Boolean(errors.phone), inverted),
              "flex items-center gap-1 px-3 py-0 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/25"
            )}
          >
            <span className="select-none pl-1 text-[15px] font-medium text-brand-700">+7</span>
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={formatPhoneDigits(values.phone)}
              onChange={(event) => setField("phone", normalizePhoneDigits(event.target.value))}
              className="w-full border-0 bg-transparent py-3 text-[15px] text-brand-900 outline-none placeholder:text-ink-soft"
              placeholder={PHONE_PLACEHOLDER}
              maxLength={PHONE_PLACEHOLDER.length + 2}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
            />
          </div>
          {errors.phone && (
            <p id={`${uid}-phone-error`} className={errorClass}>
              <CircleAlert className="h-4 w-4 shrink-0" /> {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-email`}>
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            className={fieldClass(Boolean(errors.email), inverted)}
            placeholder="name@company.kz"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          />
          {errors.email && (
            <p id={`${uid}-email-error`} className={errorClass}>
              <CircleAlert className="h-4 w-4 shrink-0" /> {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={`${uid}-property`}>
          Интересующий объект <span className="text-orange-500">*</span>
        </label>
        <select
          id={`${uid}-property`}
          name="property"
          value={values.property}
          onChange={(event) => setField("property", event.target.value)}
          className={cn(fieldClass(Boolean(errors.property), inverted), "appearance-none bg-[length:16px] pr-10")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23587487' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
          }}
          aria-invalid={Boolean(errors.property)}
          aria-describedby={errors.property ? `${uid}-property-error` : undefined}
        >
          <option value="">Выберите объект</option>
          {PROPERTY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.property && (
          <p id={`${uid}-property-error`} className={errorClass}>
            <CircleAlert className="h-4 w-4 shrink-0" /> {errors.property}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor={`${uid}-comment`}>
          Комментарий
        </label>
        <textarea
          id={`${uid}-comment`}
          name="comment"
          rows={3}
          value={values.comment}
          onChange={(event) => setField("comment", event.target.value)}
          className={cn(fieldClass(false, inverted), "resize-y")}
          placeholder="Нужная площадь, сроки заезда, пожелания"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3" htmlFor={`${uid}-consent`}>
          <input
            id={`${uid}-consent`}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(event) => setField("consent", event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-brand-300 accent-orange-500"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
          />
          <span className={cn("text-sm leading-snug", inverted ? "text-brand-100" : "text-ink-muted")}>
            Я согласен на обработку персональных данных в соответствии с{" "}
            <Link
              to="/privacy"
              target="_blank"
              className={cn("underline underline-offset-2", inverted ? "text-white" : "text-brand-700 hover:text-orange-600")}
            >
              политикой конфиденциальности
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${uid}-consent-error`} className={errorClass}>
            <CircleAlert className="h-4 w-4 shrink-0" /> {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {submitError}. Попробуйте отправить ещё раз или напишите нам в WhatsApp — ответим
              быстро.
            </span>
          </p>
          <LinkButton
            href={whatsappLink(`Здравствуйте! Не отправилась заявка с сайта. Меня зовут ${values.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => track("whatsapp_click", { source: "form-error" })}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Написать в WhatsApp
          </LinkButton>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Отправляем…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Отправить заявку
            </>
          )}
        </Button>
        <p className={cn("text-xs leading-snug", inverted ? "text-brand-200" : "text-ink-soft")}>
          Или позвоните:{" "}
          <a href={CONTACTS.phoneHref} className="font-medium underline underline-offset-2">
            {CONTACTS.phone}
          </a>
        </p>
      </div>
    </form>
  )
}
