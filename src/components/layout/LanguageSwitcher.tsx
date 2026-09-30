import { cn } from "../../lib/utils"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import { LOCALES, LOCALE_LABELS, type Locale } from "../../lib/i18n/types"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-xl border border-brand-200 bg-white p-0.5 text-xs font-semibold",
        className
      )}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-lg px-2.5 py-1.5 transition",
            locale === code
              ? "bg-brand-900 text-white"
              : "text-brand-700 hover:bg-brand-50 hover:text-brand-900"
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
