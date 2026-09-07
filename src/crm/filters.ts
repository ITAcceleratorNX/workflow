/** Состояние фильтров главного экрана и его перевод в параметры запроса. */

import { ANY } from "@shared/crm.js"
import type { LeadFilters, SortState } from "./types"

export const EMPTY_FILTERS: LeadFilters = {
  q: "",
  office_format: ANY,
  property: ANY,
  client_need: ANY,
  processing: ANY,
  status: ANY,
  quality: ANY,
  outcome: ANY,
  reject_reason: ANY,
  manager: ANY,
  date_from: "",
  date_to: "",
}

/** Подписи для чипов активных фильтров под панелью поиска. */
export const FILTER_LABELS: Record<keyof LeadFilters, string> = {
  q: "Поиск",
  office_format: "Формат офиса",
  property: "Интересующий объект",
  client_need: "Что ищет клиент",
  processing: "Обработка",
  status: "Статус лида",
  quality: "Качество лида",
  outcome: "Итог лида",
  reject_reason: "Причина отказа",
  manager: "Ответственный менеджер",
  date_from: "Дата с",
  date_to: "Дата по",
}

const isActive = (key: keyof LeadFilters, value: string) =>
  Boolean(value) && (key === "q" || key === "date_from" || key === "date_to" ? true : value !== ANY)

/** Только выбранные фильтры — в положении «Все» фильтр в запрос не уходит. */
export function activeFilters(filters: LeadFilters): Array<[keyof LeadFilters, string]> {
  return (Object.entries(filters) as Array<[keyof LeadFilters, string]>).filter(([key, value]) =>
    isActive(key, value)
  )
}

/** Параметры запроса для списка и для выгрузки CSV — одни и те же. */
export function toSearchParams(
  filters: LeadFilters,
  sort: SortState,
  page?: { page: number; pageSize: number }
): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of activeFilters(filters)) {
    params.set(key, value)
  }

  params.set("sort", sort.column)
  params.set("order", sort.order)

  if (page) {
    params.set("page", String(page.page))
    params.set("page_size", String(page.pageSize))
  }

  return params
}
