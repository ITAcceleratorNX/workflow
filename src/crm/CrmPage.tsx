import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import * as api from "./api"
import { LoginScreen } from "./components/LoginScreen"
import { LeadsScreen } from "./components/LeadsScreen"

type Access = "checking" | "guest" | "signed-in"

/**
 * Точка входа CRM (маршрут /crm).
 *
 * Экран определяется наличием действующей сессии: сервер решает, пускать ли
 * дальше, а страница только показывает нужное состояние.
 */
export function CrmPage() {
  const [access, setAccess] = useState<Access>("checking")

  /* Служебный экран не должен попадать в поисковую выдачу */
  useEffect(() => {
    document.title = "CRM · TMK WorkFlow"

    const robots = document.createElement("meta")
    robots.setAttribute("name", "robots")
    robots.setAttribute("content", "noindex, nofollow")
    document.head.appendChild(robots)

    return () => robots.remove()
  }, [])

  useEffect(() => {
    let active = true

    api
      .checkSession()
      .then((authenticated) => {
        if (active) setAccess(authenticated ? "signed-in" : "guest")
      })
      .catch(() => {
        if (active) setAccess("guest")
      })

    return () => {
      active = false
    }
  }, [])

  const handleLogin = useCallback(async (password: string) => {
    await api.login(password)
    setAccess("signed-in")
  }, [])

  const handleSignOut = useCallback(() => {
    setAccess("guest")
    /* Выход не должен ломать интерфейс, даже если запрос не дошёл */
    void api.logout().catch(() => undefined)
  }, [])

  if (access === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
        <span className="sr-only">Проверяем доступ</span>
      </div>
    )
  }

  if (access === "guest") return <LoginScreen onSubmit={handleLogin} />

  return <LeadsScreen onSignOut={handleSignOut} />
}

export default CrmPage
