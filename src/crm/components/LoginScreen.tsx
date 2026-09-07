import { useState, type FormEvent } from "react"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import { INPUT_BASE, borderFor } from "./fieldStyles"

/** Вход по одному общему паролю без логина (раздел 16 ТЗ). */
export function LoginScreen({ onSubmit }: { onSubmit: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (pending || !password) return

    setPending(true)
    setError("")
    try {
      await onSubmit(password)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось войти")
      setPassword("")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/logo-80.webp"
            srcSet="/logo-80.webp 1x, /logo-120.webp 2x"
            alt=""
            className="h-14 w-14 rounded-xl object-contain"
            width={56}
            height={56}
          />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-900">
            TMK <span className="text-orange-500">WorkFlow</span>
          </h1>
          <p className="mt-1 text-sm text-ink-muted">CRM обработки заявок с сайта</p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-6 shadow-float">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-brand-900">Пароль доступа</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                autoFocus
                type={visible ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                placeholder="Введите пароль"
                aria-invalid={Boolean(error) || undefined}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError("")
                }}
                className={cn(INPUT_BASE, "h-12 pl-9 pr-11", borderFor(Boolean(error)))}
              />
              <button
                type="button"
                onClick={() => setVisible((shown) => !shown)}
                aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink"
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[13px] font-medium text-rose-700">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={pending || !password}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Проверяем" : "Войти"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-ink-soft">
          Доступ по общему паролю. Если пароль не подходит, запросите актуальный у администратора.
        </p>
      </div>
    </div>
  )
}
