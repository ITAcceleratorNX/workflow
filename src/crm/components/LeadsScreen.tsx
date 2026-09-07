import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, LogOut, Plus, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import { INPUT_BASE, borderFor } from "./fieldStyles"
import { ActiveFilterChips, FiltersPanel } from "./FiltersPanel"
import { LeadsTable } from "./LeadsTable"
import { LeadModal } from "./LeadModal"
import { Pagination } from "./Pagination"
import { Toast, type ToastMessage } from "./Toast"
import { EMPTY_FILTERS, activeFilters, toSearchParams } from "../filters"
import * as api from "../api"
import type { Lead, LeadDraft, LeadFilters, SortColumn, SortState } from "../types"

/** Поиск не должен дёргать сервер на каждую букву. */
const SEARCH_DEBOUNCE_MS = 350

export function LeadsScreen({ onSignOut }: { onSignOut: () => void }) {
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS)
  const [search, setSearch] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState<SortState>({ column: "created_at", order: "desc" })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const [rows, setRows] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  /* null — карточка закрыта; undefined — открыт новый лид */
  const [openLead, setOpenLead] = useState<Lead | null | undefined>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  /* Ответы медленных запросов не должны перетирать свежие данные */
  const requestId = useRef(0)

  const notify = useCallback((text: string, tone: ToastMessage["tone"]) => {
    setToast({ id: Date.now(), text, tone })
  }, [])

  /* Строка поиска попадает в фильтры с задержкой; страница при этом сбрасывается */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) => (current.q === search ? current : { ...current, q: search }))
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [search])

  const params = useMemo(
    () => toSearchParams(filters, sort, { page, pageSize }).toString(),
    [filters, sort, page, pageSize]
  )

  const load = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)

    try {
      const data = await api.fetchLeads(new URLSearchParams(params))
      if (id !== requestId.current) return
      setRows(data.rows)
      setTotal(data.total)
    } catch (error) {
      if (id !== requestId.current) return
      if (error instanceof api.CrmError && error.status === 401) {
        onSignOut()
        return
      }
      notify(error instanceof Error ? error.message : "Не удалось загрузить лиды", "error")
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [params, notify, onSignOut])

  useEffect(() => {
    void load()
  }, [load])

  /* Фильтры и размер страницы меняют выборку — номер страницы становится неверным */
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  /* «/» ставит курсор в поиск, как в почтовых и таск-трекерах */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      if (event.key === "/" && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const activeCount = activeFilters(filters).filter(([key]) => key !== "q").length

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearch("")
  }

  const clearFilter = (key: keyof LeadFilters) => {
    if (key === "q") setSearch("")
    setFilters((current) => ({ ...current, [key]: EMPTY_FILTERS[key] }))
  }

  const toggleSort = (column: SortColumn) =>
    setSort((current) =>
      current.column === column
        ? { column, order: current.order === "asc" ? "desc" : "asc" }
        : { column, order: "desc" }
    )

  async function handleExport() {
    setExporting(true)
    try {
      /* Выгрузка повторяет фильтры экрана, но не ограничена страницей (раздел 14) */
      await api.exportCsv(toSearchParams(filters, sort))
      notify("Файл CSV выгружен", "success")
    } catch (error) {
      notify(error instanceof Error ? error.message : "Не удалось выгрузить лиды", "error")
    } finally {
      setExporting(false)
    }
  }

  async function handleSave(draft: LeadDraft) {
    if (openLead) {
      await api.saveLead(openLead.id, draft)
      notify("Лид сохранён", "success")
    } else {
      await api.createLead(draft)
      notify("Лид создан", "success")
    }
    setOpenLead(null)
    await load()
  }

  return (
    <div className="min-h-screen bg-brand-50/60">
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo-40.webp"
              srcSet="/logo-40.webp 1x, /logo-80.webp 2x"
              alt=""
              className="h-9 w-9 rounded-lg object-contain"
              width={36}
              height={36}
            />
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-tight text-brand-900">
                TMK <span className="text-orange-500">WorkFlow</span>
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                CRM · заявки с сайта
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Лиды</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {loading && rows.length === 0 ? "Загружаем заявки" : `Всего заявок: ${total}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Имя, компания, телефон, email"
                className={cn(INPUT_BASE, "h-10 pl-9 pr-9", borderFor(false))}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Очистить поиск"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen((open) => !open)}
              className={cn("h-10", filtersOpen && "border-brand-400 bg-brand-50")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {activeCount > 0 && (
                <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void load()}
              disabled={loading}
              aria-label="Обновить список"
              className="h-10"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              <span className="hidden sm:inline">Обновить</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              aria-label="Экспорт лидов в CSV"
              className="h-10"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{exporting ? "Готовим" : "Экспорт CSV"}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setOpenLead(undefined)}
              aria-label="Добавить лид вручную"
              className="h-10"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Добавить лид</span>
            </Button>
          </div>
        </div>

        <FiltersPanel open={filtersOpen} filters={filters} onChange={setFilters} onReset={resetFilters} />
        <ActiveFilterChips filters={filters} onClear={clearFilter} />

        <LeadsTable
          rows={rows}
          loading={loading}
          sort={sort}
          onSort={toggleSort}
          onOpen={setOpenLead}
          onResetFilters={resetFilters}
          hasFilters={activeFilters(filters).length > 0}
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
          onPageSize={setPageSize}
        />
      </main>

      {openLead !== null && (
        <LeadModal lead={openLead ?? null} onClose={() => setOpenLead(null)} onSave={handleSave} />
      )}

      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md flex-col gap-2 sm:inset-x-auto sm:right-6">
        {toast && <Toast key={toast.id} toast={toast} onDismiss={() => setToast(null)} />}
      </div>
    </div>
  )
}
