import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { INPUT_BASE, borderFor } from "./fieldStyles"

const PAGE_SIZES = [10, 25, 50, 100]

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}

export function Pagination({ page, pageSize, total, onPage, onPageSize }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-[13px] text-ink-muted">
        Показывать по
        <select
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
          className={cn(INPUT_BASE, borderFor(false), "h-9 w-auto cursor-pointer py-0 pr-8")}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-ink-muted">
          {from}–{to} из {total}
        </span>
        <div className="flex items-center gap-1">
          <PageButton label="Предыдущая страница" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
          <span className="min-w-[76px] text-center text-[13px] font-semibold text-brand-900">
            {page} / {pages}
          </span>
          <PageButton label="Следующая страница" disabled={page >= pages} onClick={() => onPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </PageButton>
        </div>
      </div>
    </div>
  )
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-white text-ink transition-colors hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand-200 disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}
