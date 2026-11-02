export const SITE_URL = "https://tmk-workflow.kz"

export const CONTACTS = {
  phone: "+7 700 973 7138",
  phoneHref: "tel:+77009737138",
  whatsapp: "https://wa.me/77009737138",
  email: "yerlepessov.t@tmk-limited.com",
} as const

export const whatsappLink = (message?: string) =>
  message ? `${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}` : CONTACTS.whatsapp

/**
 * Аналитика подключается при предоставлении идентификаторов (раздел 11 ТЗ).
 * Хелпер безопасно отправляет событие во все счётчики, которые есть на странице.
 */
type TrackPayload = Record<string, string | number | boolean | undefined>

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  ym?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

/**
 * Событие успешной отправки формы «Записаться на просмотр» для Google Tag Manager.
 * Персональные данные не передаются — только факт отправки и выбранный объект.
 * Вызывать после подтверждения от сервера, а не по клику на кнопку.
 */
export function trackFormSubmitSuccess(property: string) {
  if (typeof window === "undefined") return
  const w = window as AnalyticsWindow

  try {
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({
      event: "form_submit_success",
      form_name: "viewing_request",
      object: property,
    })
  } catch {
    /* аналитика не должна ломать интерфейс */
  }
}

export function track(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return
  const w = window as AnalyticsWindow

  try {
    w.dataLayer?.push({ event, ...payload })
    w.gtag?.("event", event, payload)
    if (typeof w.ym === "function") {
      const counterId = (import.meta.env.VITE_YM_COUNTER_ID as string | undefined) ?? ""
      if (counterId) w.ym(Number(counterId), "reachGoal", event, payload)
    }
    if (event === "lead_submit") w.fbq?.("track", "Lead", payload)
  } catch {
    /* аналитика не должна ломать интерфейс */
  }
}

/**
 * Конверсия WhatsApp: шлём до window.open, иначе на телефоне вкладка уходит
 * в фон и обычный gtag/dataLayer часто не успевает уйти. beacon — надёжнее.
 */
export function trackWhatsAppFormSubmit(payload: {
  property?: string
  placement: string
}) {
  if (typeof window === "undefined") return
  const w = window as AnalyticsWindow

  try {
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event: "whatsapp_form_submit", ...payload })
    w.gtag?.("event", "whatsapp_form_submit", {
      ...payload,
      transport_type: "beacon",
    })
  } catch {
    /* аналитика не должна ломать интерфейс */
  }
}
