export type Locale = "ru" | "kk"

export const LOCALES: Locale[] = ["ru", "kk"]

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "RU",
  kk: "KZ",
}

export const LOCALE_OG: Record<Locale, string> = {
  ru: "ru_RU",
  kk: "kk_KZ",
}

export const DEFAULT_LOCALE: Locale = "ru"
export const LOCALE_STORAGE_KEY = "tmk_locale"

export function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "kk"
}
