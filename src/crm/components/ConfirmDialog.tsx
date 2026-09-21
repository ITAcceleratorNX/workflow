import { useEffect, useRef } from "react"
import { Loader2, TriangleAlert } from "lucide-react"
import { Button } from "../../components/ui/button"

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Подтверждение необратимого действия.
 *
 * Поверх карточки лида (z-50), поэтому слой выше — иначе диалог оказался бы под
 * ней. Фокус сразу на отмене: случайный Enter ничего не удалит.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      /* Диалог поверх карточки: Escape закрывает только его */
      event.stopPropagation()
      if (!busy) onCancel()
    }
    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [busy, onCancel])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-brand-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-float sm:rounded-3xl sm:p-6"
      >
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-[17px] font-bold text-brand-900">
              {title}
            </h2>
            <p id="confirm-description" className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="outline" size="sm" onClick={onCancel} disabled={busy}>
            Отмена
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            className="bg-rose-600 shadow-[0_8px_20px_-8px_rgba(225,29,72,0.7)] hover:bg-rose-700 hover:shadow-[0_12px_26px_-8px_rgba(225,29,72,0.75)] focus-visible:ring-rose-500"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Удаляем" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
