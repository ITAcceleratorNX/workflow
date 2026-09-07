/** Обращения к серверным функциям CRM. Ошибки приходят понятным текстом. */

import type { Lead, LeadDraft, LeadsPage } from "./types"

class CrmError extends Error {
  /** 401 означает «сессия кончилась» — экран возвращает к форме входа. */
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "CrmError"
    this.status = status
  }
}

export { CrmError }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json", ...init?.headers } : init?.headers,
  })

  if (!response.ok) {
    let message = "Не удалось выполнить операцию"
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      /* тело ответа может быть пустым */
    }
    throw new CrmError(message, response.status)
  }

  return (await response.json()) as T
}

export const checkSession = () =>
  request<{ authenticated: boolean }>("/api/crm/session").then((data) => data.authenticated)

export const login = (password: string) =>
  request<{ ok: true }>("/api/crm/session", { method: "POST", body: JSON.stringify({ password }) })

export const logout = () => request<{ ok: true }>("/api/crm/session", { method: "DELETE" })

export const fetchLeads = (params: URLSearchParams) =>
  request<LeadsPage>(`/api/crm/leads?${params.toString()}`)

export const createLead = (draft: Partial<LeadDraft>) =>
  request<{ lead: Lead }>("/api/crm/leads", { method: "POST", body: JSON.stringify(draft) }).then(
    (data) => data.lead
  )

export const saveLead = (id: number, draft: Partial<LeadDraft>) =>
  request<{ lead: Lead }>("/api/crm/leads", {
    method: "PATCH",
    body: JSON.stringify({ ...draft, id }),
  }).then((data) => data.lead)

/**
 * Выгрузка CSV. Файл забираем через fetch, а не переходом по ссылке:
 * так ошибка приходит текстом, а не пустой вкладкой.
 */
export async function exportCsv(params: URLSearchParams): Promise<void> {
  const response = await fetch(`/api/crm/export?${params.toString()}`)

  if (!response.ok) {
    let message = "Не удалось выгрузить лиды"
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      /* сервер мог ответить не JSON */
    }
    throw new CrmError(message, response.status)
  }

  const blob = await response.blob()
  const name =
    /filename="([^"]+)"/.exec(response.headers.get("Content-Disposition") ?? "")?.[1] ?? "leads.csv"

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
