import { readAdParams } from "./attribution"
import { PROPERTIES } from "./properties"
import { whatsappLink } from "./site"

export type WhatsAppPlacement = "header" | "footer" | "viewing"

export interface OpenWhatsAppGateOptions {
  placement: WhatsAppPlacement
  /** Если не передан — берётся из текущего пути */
  property?: string
}

const STORAGE_KEY = "tmk_wa_phone_sent"
const STORAGE_DAYS = 30
const SUBMIT_TIMEOUT_MS = 5000

export function propertyFromPath(pathname: string): string {
  return PROPERTIES.find((property) => property.path === pathname)?.name ?? ""
}

export function whatsappHrefFor(property: string, gclid?: string): string {
  const interest = property || "аренда офиса"
  const text = gclid
    ? `Здравствуйте! Пишу с сайта TMK WorkFlow, интересует ${interest}. #ref:g-${gclid}`
    : `Здравствуйте! Пишу с сайта TMK WorkFlow, интересует ${interest}.`
  return whatsappLink(text)
}

export function hasSentWhatsAppPhone(): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const expiresAt = Number(raw)
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function markWhatsAppPhoneSent(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + STORAGE_DAYS * 24 * 60 * 60 * 1000)
    )
  } catch {
    /* private mode */
  }
}

export async function submitWhatsAppLead(payload: {
  phone: string
  property: string
  placement: WhatsAppPlacement
  page: string
}): Promise<{ countConversion: boolean }> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)

  try {
    const response = await fetch("/api/whatsapp-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ ...payload, ...readAdParams() }),
    })

    /* Явная ошибка сервера — конверсию не считаем */
    if (!response.ok) return { countConversion: false }

    const data = (await response.json().catch(() => null)) as { ok?: boolean } | null
    if (data?.ok === false) return { countConversion: false }

    return { countConversion: true }
  } catch {
    /* Таймаут и сетевые сбои: Apps Script часто отвечает дольше 5 с,
       строка в реестр уже пишется — конверсию считаем. */
    return { countConversion: true }
  } finally {
    window.clearTimeout(timer)
  }
}

/** false — показать кнопку-ссылку (Safari часто блокирует open после await). */
export function openWhatsApp(href: string): boolean {
  if (typeof window === "undefined") return false
  const popup = window.open(href, "_blank")
  if (!popup) return false
  try {
    popup.opener = null
  } catch {
    /* ignore */
  }
  return true
}
