/**
 * Цвета меток статусов. Вынесены из компонента отдельным модулем — так же,
 * как buttonVariants рядом с Button: файл компонента остаётся пригодным
 * для быстрой перезагрузки во время разработки.
 *
 * Цвет отражает место статуса в воронке (раздел 18 ТЗ): синий — работа идёт,
 * фиолетовый — просмотр, зелёный — сделка, красный — потеря, серый — исключён.
 */

import type { LeadQuality, LeadStatus, ProcessingState } from "../types"

const NEUTRAL = "bg-slate-100 text-slate-600 ring-slate-200"

export const STATUS_STYLES: Record<LeadStatus, string> = {
  "Новый": "bg-orange-50 text-orange-700 ring-orange-200",
  "Связались": "bg-brand-50 text-brand-700 ring-brand-200",
  "Не дозвонились": "bg-amber-50 text-amber-700 ring-amber-200",
  "Выявление потребности": "bg-brand-50 text-brand-700 ring-brand-200",
  "Предложение отправлено": "bg-brand-100 text-brand-800 ring-brand-300",
  "Просмотр назначен": "bg-violet-50 text-violet-700 ring-violet-200",
  "Просмотр проведён": "bg-violet-100 text-violet-800 ring-violet-300",
  "Переговоры": "bg-sky-100 text-sky-800 ring-sky-300",
  "Договор на согласовании": "bg-teal-50 text-teal-700 ring-teal-200",
  "Сделка": "bg-emerald-100 text-emerald-800 ring-emerald-300",
  "Отложен": "bg-amber-50 text-amber-700 ring-amber-200",
  "Отказ": "bg-rose-50 text-rose-700 ring-rose-200",
  "Нецелевой": NEUTRAL,
  "Дубль": NEUTRAL,
}

export const PROCESSING_STYLES: Record<ProcessingState, string> = {
  "Не обработан": "bg-orange-100 text-orange-800 ring-orange-300",
  "В работе": "bg-brand-100 text-brand-800 ring-brand-300",
  "Обработан": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Закрыт": NEUTRAL,
}

export const QUALITY_STYLES: Record<LeadQuality, string> = {
  "Горячий": "bg-rose-100 text-rose-800 ring-rose-300",
  "Тёплый": "bg-amber-100 text-amber-800 ring-amber-300",
  "Холодный": "bg-sky-100 text-sky-800 ring-sky-300",
  "Нецелевой": NEUTRAL,
  "Дубль": NEUTRAL,
  "Спам / ошибочная заявка": NEUTRAL,
}

export const BADGE_BASE =
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap"

export const FALLBACK_BADGE = NEUTRAL
