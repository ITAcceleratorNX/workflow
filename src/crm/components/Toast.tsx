import { useEffect } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ToastMessage {
  id: number
  text: string
  tone: "success" | "error"
}

/** Всплывающее уведомление о результате действия. Успех гаснет сам, ошибка ждёт закрытия. */
export function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  useEffect(() => {
    if (toast.tone === "error") return
    const timer = window.setTimeout(onDismiss, 3500)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  const success = toast.tone === "success"

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-float",
        success ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
      )}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
      )}
      <p className={cn("text-[14px] font-medium", success ? "text-emerald-900" : "text-rose-900")}>
        {toast.text}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Закрыть уведомление"
        className="ml-auto -mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-white/70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
