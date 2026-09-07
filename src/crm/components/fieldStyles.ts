/** Общие классы полей карточки лида и панели фильтров. */

export const INPUT_BASE =
  "w-full rounded-xl border bg-white px-3 text-[14px] text-ink transition-colors " +
  "placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-orange-400/60 " +
  "disabled:bg-brand-50/60 disabled:text-ink-muted"

export const INPUT_HEIGHT = "h-10"

/** Незаполненное обязательное поле подсвечивается рамкой, а не только текстом ошибки. */
export const borderFor = (invalid?: boolean) =>
  invalid ? "border-rose-400 focus:ring-rose-300" : "border-brand-200 hover:border-brand-300"

export const LABEL_BASE = "mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-ink-muted"
