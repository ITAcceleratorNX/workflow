/** Форматирование значений для таблицы и карточки лида. */

const TZ = "Asia/Almaty"

/** Дата и время заявки в часовом поясе менеджера, а не браузера. */
export function formatDateTime(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleString("ru-RU", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(value: string | null): string {
  if (!value) return "—"
  /* Поля-даты приходят строкой «ГГГГ-ММ-ДД» — разбираем без часового пояса */
  const [year, month, day] = value.split("-")
  return year && month && day ? `${day}.${month}.${year}` : value
}

/** Суммы в тенге с неразрывными разрядами. */
export const formatMoney = (value: number | null): string =>
  value === null || value === undefined ? "—" : `${value.toLocaleString("ru-RU")} ₸`

export const formatArea = (value: number | null): string =>
  value === null || value === undefined ? "—" : `${value.toLocaleString("ru-RU")} м²`

/** Телефон в базе хранится как +7XXXXXXXXXX — показываем привычной маской. */
export function formatPhone(value: string | null): string {
  if (!value) return "—"
  const digits = value.replace(/\D/g, "")
  if (digits.length !== 11) return value
  return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

export const telHref = (value: string | null): string => `tel:${(value ?? "").replace(/[^\d+]/g, "")}`

/** Диапазон площади одной строкой: «от 80 до 120 м²». */
export function formatAreaRange(from: number | null, to: number | null): string {
  if (from === null && to === null) return "—"
  if (from !== null && to !== null) return `${from}–${to} м²`
  return from !== null ? `от ${from} м²` : `до ${to} м²`
}

export const dash = (value: string | null | undefined): string => (value ? value : "—")
