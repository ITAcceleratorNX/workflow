import { ArrowDown, ArrowUp, ChevronsUpDown, Inbox } from "lucide-react"
import { PROCESSING } from "@shared/crm.js"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { ProcessingBadge, StatusBadge } from "./Badges"
import { dash, formatDateTime, formatPhone, telHref } from "../format"
import type { Lead, SortColumn, SortState } from "../types"

interface Column {
  key: string
  title: string
  sort?: SortColumn
  className?: string
}

/**
 * Колонки из раздела 5 ТЗ. Технические параметры живут только в карточке.
 * Ширины подобраны так, чтобы кнопка действия помещалась на экране ноутбука;
 * длинные значения обрезаются многоточием, полный текст — в подсказке.
 */
const COLUMNS: Column[] = [
  { key: "name", title: "Имя / компания", sort: "name", className: "w-[195px]" },
  { key: "phone", title: "Телефон", className: "w-[150px]" },
  { key: "source", title: "Источник", className: "w-[145px]" },
  { key: "processing", title: "Обработка", sort: "processing", className: "w-[130px]" },
  { key: "status", title: "Статус", sort: "status", className: "w-[165px]" },
  { key: "manager", title: "Менеджер", sort: "manager", className: "w-[135px]" },
  { key: "property", title: "Объект / формат", className: "w-[170px]" },
  { key: "created_at", title: "Дата", sort: "created_at", className: "w-[125px]" },
  { key: "action", title: "Действие", className: "w-[115px]" },
]

interface LeadsTableProps {
  rows: Lead[]
  loading: boolean
  sort: SortState
  onSort: (column: SortColumn) => void
  onOpen: (lead: Lead) => void
  onResetFilters: () => void
  hasFilters: boolean
}

export function LeadsTable({
  rows,
  loading,
  sort,
  onSort,
  onOpen,
  onResetFilters,
  hasFilters,
}: LeadsTableProps) {
  return (
    <div className="card-base mt-3 overflow-hidden">
      {/* Таблица шире экрана прокручивается сама, страница по горизонтали не едет */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1330px] table-fixed border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-brand-100 bg-brand-50/70">
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-ink-muted",
                    column.className
                  )}
                >
                  {column.sort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.sort as SortColumn)}
                      /* uppercase повторяется: базовые стили Tailwind сбрасывают регистр у кнопок */
                      className="inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-brand-700"
                    >
                      {column.title}
                      <SortIcon active={sort.column === column.sort} order={sort.order} />
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && rows.length === 0 && <SkeletonRows />}

            {!loading &&
              rows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-16">
                    <EmptyState hasFilters={hasFilters} onResetFilters={onResetFilters} />
                  </td>
                </tr>
              )}

            {rows.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onOpen={onOpen} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Обновление поверх уже показанных строк: таблица не схлопывается */}
      {loading && rows.length > 0 && (
        <div className="h-0.5 w-full overflow-hidden bg-brand-100">
          <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-orange-500" />
        </div>
      )}
    </div>
  )
}

function LeadRow({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  const unprocessed = lead.processing === PROCESSING.NEW

  return (
    <tr
      onClick={() => onOpen(lead)}
      className={cn(
        "cursor-pointer border-b border-brand-50 transition-colors last:border-0 hover:bg-brand-50/60",
        unprocessed && "bg-orange-50/30"
      )}
    >
      <td className="px-4 py-3">
        <div className="flex items-start gap-2.5">
          {/* Полоска слева отмечает необработанные заявки, не занимая колонку */}
          <span
            aria-hidden
            className={cn("mt-1 h-8 w-1 shrink-0 rounded-full", unprocessed ? "bg-orange-500" : "bg-transparent")}
          />
          <div className="min-w-0">
            <div className="truncate font-semibold text-brand-900" title={lead.name}>
              {lead.name || "Без имени"}
            </div>
            <div className="truncate text-[13px] text-ink-muted" title={lead.company ?? ""}>
              {dash(lead.company)}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        {lead.phone ? (
          <a
            href={telHref(lead.phone)}
            onClick={(event) => event.stopPropagation()}
            className="whitespace-nowrap font-medium text-brand-700 transition-colors hover:text-orange-600"
          >
            {formatPhone(lead.phone)}
          </a>
        ) : (
          <span className="text-ink-soft">—</span>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="truncate text-[13px] text-ink-muted" title={lead.source_label ?? ""}>
          {dash(lead.source_label)}
        </div>
      </td>

      <td className="px-4 py-3">
        <ProcessingBadge value={lead.processing} />
      </td>

      <td className="px-4 py-3">
        <StatusBadge value={lead.status} />
      </td>

      <td className="px-4 py-3">
        <div className="truncate text-ink" title={lead.manager ?? ""}>
          {dash(lead.manager)}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="truncate text-ink">{dash(lead.property)}</div>
        <div className="truncate text-[13px] text-ink-muted">{dash(lead.office_format)}</div>
      </td>

      <td className="px-4 py-3">
        <div className="whitespace-nowrap text-[13px] text-ink-muted">{formatDateTime(lead.created_at)}</div>
      </td>

      <td className="px-4 py-3">
        <Button
          size="sm"
          variant={unprocessed ? "primary" : "outline"}
          onClick={(event) => {
            event.stopPropagation()
            onOpen(lead)
          }}
          className="w-full"
        >
          {unprocessed ? "Обработать" : "Открыть"}
        </Button>
      </td>
    </tr>
  )
}

function SortIcon({ active, order }: { active: boolean; order: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
  return order === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-orange-500" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-orange-500" />
  )
}

/** Пока идёт первая загрузка, показываем каркас строк вместо прыжка вёрстки. */
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, row) => (
        <tr key={row} className="border-b border-brand-50 last:border-0">
          {COLUMNS.map((column) => (
            <td key={column.key} className="px-4 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-brand-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function EmptyState({ hasFilters, onResetFilters }: { hasFilters: boolean; onResetFilters: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
        <Inbox className="h-6 w-6" />
      </span>
      <p className="mt-3 font-semibold text-brand-900">
        {hasFilters ? "Под фильтры ничего не подходит" : "Лидов пока нет"}
      </p>
      <p className="mt-1 max-w-sm text-[13px] text-ink-muted">
        {hasFilters
          ? "Измените условия отбора или сбросьте фильтры, чтобы увидеть все заявки."
          : "Новые заявки с сайта появляются здесь автоматически. Лид можно добавить и вручную."}
      </p>
      {hasFilters && (
        <Button size="sm" variant="outline" className="mt-4" onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}
