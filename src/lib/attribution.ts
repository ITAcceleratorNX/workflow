/**
 * Метки рекламы (ТЗ Bankai.Agency от 04.09.2026).
 *
 * gclid и utm-параметры есть в адресе только на первой странице после клика по
 * объявлению. Человек может пройтись по сайту и отправить форму уже со страницы
 * объекта — там меток в адресе нет. Поэтому запоминаем их при первом заходе
 * и подставляем в заявку в момент отправки.
 */

export const AD_PARAMS = ["gclid", "utm_source", "utm_campaign", "utm_term"] as const

export type AdParam = (typeof AD_PARAMS)[number]
export type AdParams = Partial<Record<AdParam, string>>

/** Срок жизни метки — 90 дней, как в ТЗ. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90

/** Значение приходит из адресной строки, поэтому ограничиваем длину. */
const MAX_VALUE_LENGTH = 300

/** Вызывается один раз при загрузке страницы — до того, как метки исчезнут из адреса. */
export function captureAdParams() {
  if (typeof window === "undefined") return

  const search = new URLSearchParams(window.location.search)

  for (const param of AD_PARAMS) {
    const value = search.get(param)
    if (!value) continue

    document.cookie = [
      `${param}=${encodeURIComponent(value.slice(0, MAX_VALUE_LENGTH))}`,
      "path=/",
      `max-age=${MAX_AGE_SECONDS}`,
      "SameSite=Lax",
    ].join(";")
  }
}

/** Читает сохранённые метки. Пустой объект — заявка пришла не с рекламы. */
export function readAdParams(): AdParams {
  if (typeof document === "undefined") return {}

  const jar = new Map<string, string>()
  for (const entry of document.cookie.split(";")) {
    const trimmed = entry.trim()
    if (!trimmed) continue
    const separator = trimmed.indexOf("=")
    if (separator === -1) continue
    jar.set(trimmed.slice(0, separator), trimmed.slice(separator + 1))
  }

  const params: AdParams = {}
  for (const param of AD_PARAMS) {
    const raw = jar.get(param)
    if (!raw) continue
    try {
      params[param] = decodeURIComponent(raw)
    } catch {
      /* повреждённое значение игнорируем, заявка важнее метки */
    }
  }

  return params
}
