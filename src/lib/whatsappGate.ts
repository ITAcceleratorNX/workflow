import { readAdParams } from "./attribution"
import { PROPERTIES } from "./properties"
import { whatsappLink } from "./site"

export type WhatsAppPlacement = "header" | "hero" | "footer" | "viewing"

export interface OpenWhatsAppGateOptions {
  placement: WhatsAppPlacement
  /** Если не передан — берётся из текущего пути */
  property?: string
}

const STORAGE_KEY = "tmk_wa_phone_sent"
const STORAGE_DAYS = 30

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

/** Заявка в реестр/CRM. Конверсию в GA шлём отдельно до открытия WhatsApp. */
export function submitWhatsAppLead(payload: {
  phone: string
  property: string
  placement: WhatsAppPlacement
  page: string
}): void {
  void fetch("/api/whatsapp-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /* keepalive: запрос успеет уйти, даже если вкладка ушла в фон после WhatsApp */
    keepalive: true,
    body: JSON.stringify({ ...payload, ...readAdParams() }),
  }).catch(() => {
    /* сеть не должна мешать уже открытому WhatsApp */
  })
}

/** Открывать синхронно в обработчике клика — после await браузер блокирует popup. */
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
