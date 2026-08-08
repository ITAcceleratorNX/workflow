import { PROPERTY_OPTIONS } from "./properties"

/** Точки открытия формы (раздел 9.1 ТЗ) — источник передаётся вместе с заявкой. */
export type LeadSource =
  | "hero-select-office"
  | "serviced-office"
  | "viewing"
  | "header-contact"
  | "property-contact"
  | "footer-contact"

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  "hero-select-office": "Хиро-блок — кнопка «Подобрать офис»",
  "serviced-office": "Блок «Сервисный офис» — кнопка «Подобрать сервисный офис»",
  viewing: "Форма записи на просмотр",
  "header-contact": "Верхняя панель — кнопка «Связаться с нами»",
  "property-contact": "Страница объекта — кнопка «Связаться с нами»",
  "footer-contact": "Подвал — кнопка «Связаться с нами»",
}

export interface LeadFormValues {
  name: string
  company: string
  /** Только цифры абонентского номера, без кода страны */
  phone: string
  email: string
  comment: string
  property: string
  consent: boolean
}

export const EMPTY_LEAD: LeadFormValues = {
  name: "",
  company: "",
  phone: "",
  email: "",
  comment: "",
  property: "",
  consent: false,
}

export const PHONE_PLACEHOLDER = "(___) ___-__-__"
export const PHONE_DIGITS = 10

/** Оставляет только цифры абонентского номера; корректно принимает вставку с кодом страны. */
export function normalizePhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.length > PHONE_DIGITS && (digits.startsWith("7") || digits.startsWith("8"))) {
    digits = digits.slice(1)
  }
  return digits.slice(0, PHONE_DIGITS)
}

/** Формат абонентской части под маску +7 (___) ___-__-__ */
export function formatPhoneDigits(digits: string): string {
  if (!digits) return ""
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ]

  let result = `(${parts[0]}`
  if (digits.length >= 3) result += ")"
  if (parts[1]) result += ` ${parts[1]}`
  if (parts[2]) result += `-${parts[2]}`
  if (parts[3]) result += `-${parts[3]}`
  return result
}

export const toE164 = (digits: string) => `+7${digits}`

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

export type LeadFieldErrors = Partial<Record<keyof LeadFormValues, string>>

export function validateLead(values: LeadFormValues): LeadFieldErrors {
  const errors: LeadFieldErrors = {}

  if (!values.name.trim()) {
    errors.name = "Укажите имя"
  }

  if (!values.phone) {
    errors.phone = "Укажите телефон"
  } else if (values.phone.length < PHONE_DIGITS) {
    errors.phone = "Введите номер полностью: +7 (___) ___-__-__"
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Проверьте адрес электронной почты"
  }

  if (!values.property) {
    errors.property = "Выберите объект"
  } else if (!PROPERTY_OPTIONS.includes(values.property)) {
    errors.property = "Выберите объект из списка"
  }

  if (!values.consent) {
    errors.consent = "Необходимо согласие на обработку персональных данных"
  }

  return errors
}

export interface SubmitLeadPayload extends LeadFormValues {
  source: LeadSource
  page: string
  /** Honeypot: реальные пользователи это поле не видят и не заполняют */
  website: string
  /** Время заполнения формы, мс — отсекает мгновенную отправку ботом */
  elapsedMs: number
}

export interface SubmitLeadResult {
  ok: boolean
  error?: string
}

export async function submitLead(payload: SubmitLeadPayload): Promise<SubmitLeadResult> {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      phone: toE164(payload.phone),
      sourceLabel: LEAD_SOURCE_LABELS[payload.source],
    }),
  })

  if (!response.ok) {
    let message = "Не удалось отправить заявку"
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      /* тело ответа может быть пустым */
    }
    return { ok: false, error: message }
  }

  return { ok: true }
}

export const SUCCESS_MESSAGE =
  "Спасибо! Заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время"
