import { X } from "lucide-react"
import {
  ANY,
  CLIENT_NEEDS,
  LEAD_OUTCOMES,
  LEAD_QUALITIES,
  LEAD_STATUSES,
  MANAGERS,
  OFFICE_FORMATS,
  PROCESSING_STATES,
  PROPERTY_OPTIONS,
  REJECT_REASONS,
} from "@shared/crm.js"
import { cn } from "../../lib/utils"
import { INPUT_BASE, INPUT_HEIGHT, LABEL_BASE, borderFor } from "./fieldStyles"
import { FILTER_LABELS, activeFilters } from "../filters"
import type { LeadFilters } from "../types"

interface FiltersPanelProps {
  open: boolean
  filters: LeadFilters
  onChange: (filters: LeadFilters) => void
  onReset: () => void
}

/** Порядок фильтров повторяет раздел 4 ТЗ. */
const SELECT_FILTERS: Array<{ key: keyof LeadFilters; options: readonly string[] }> = [
  { key: "office_format", options: OFFICE_FORMATS },
  { key: "property", options: PROPERTY_OPTIONS },
  { key: "client_need", options: CLIENT_NEEDS },
  { key: "processing", options: PROCESSING_STATES },
  { key: "status", options: LEAD_STATUSES },
  { key: "quality", options: LEAD_QUALITIES },
  { key: "outcome", options: LEAD_OUTCOMES },
  { key: "reject_reason", options: REJECT_REASONS },
  { key: "manager", options: MANAGERS },
]

export function FiltersPanel({ open, filters, onChange, onReset }: FiltersPanelProps) {
  const set = (key: keyof LeadFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div
      /* Панель сворачивается сеткой, а не display:none — переход остаётся плавным */
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className="card-base mt-3 p-4 sm:p-5">
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SELECT_FILTERS.map(({ key, options }) => (
              <label key={key} className="block">
                <span className={LABEL_BASE}>{FILTER_LABELS[key]}</span>
                <select
                  value={filters[key]}
                  onChange={(event) => set(key, event.target.value)}
                  className={cn(
                    INPUT_BASE,
                    INPUT_HEIGHT,
                    borderFor(false),
                    "cursor-pointer",
                    filters[key] !== ANY && "border-orange-300 bg-orange-50/50 font-medium"
                  )}
                >
                  <option value={ANY}>{ANY}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
              <label className="block">
                <span className={LABEL_BASE}>Дата с</span>
                <input
                  type="date"
                  value={filters.date_from}
                  max={filters.date_to || undefined}
                  onChange={(event) => set("date_from", event.target.value)}
                  className={cn(INPUT_BASE, INPUT_HEIGHT, borderFor(false))}
                />
              </label>
              <label className="block">
                <span className={LABEL_BASE}>Дата по</span>
                <input
                  type="date"
                  value={filters.date_to}
                  min={filters.date_from || undefined}
                  onChange={(event) => set("date_to", event.target.value)}
                  className={cn(INPUT_BASE, INPUT_HEIGHT, borderFor(false))}
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-3">
            <span className="text-[13px] text-ink-soft">Фильтры применяются вместе</span>
            <button
              type="button"
              onClick={onReset}
              className="text-[13px] font-semibold text-brand-700 transition-colors hover:text-orange-600"
            >
              Сбросить всё
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Чипы активных фильтров: видны и когда панель свёрнута. */
export function ActiveFilterChips({
  filters,
  onClear,
}: {
  filters: LeadFilters
  onClear: (key: keyof LeadFilters) => void
}) {
  const active = activeFilters(filters)
  if (active.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {active.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white py-1 pl-3 pr-1.5 text-[12px] font-medium text-ink"
        >
          <span className="text-ink-soft">{FILTER_LABELS[key]}:</span>
          {value}
          <button
            type="button"
            onClick={() => onClear(key)}
            aria-label={`Убрать фильтр «${FILTER_LABELS[key]}»`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-100 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  )
}
