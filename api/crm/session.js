/**
 * Вход в CRM по общему паролю (раздел 16 ТЗ).
 *
 *   GET    — есть ли действующая сессия
 *   POST   — вход, тело { password }
 *   DELETE — выход
 */

import {
  clearSessionCookie,
  hasSession,
  isAuthConfigured,
  issueToken,
  passwordMatches,
  setSessionCookie,
} from "../_lib/auth.js"
import { clientIp, createRateLimiter, json, methodNotAllowed, readBody } from "../_lib/http.js"

/* Пароль один на всех, поэтому подбор — единственный реальный сценарий атаки */
const isLimited = createRateLimiter({ windowMs: 5 * 60_000, max: 10 })

export default async function handler(req, res) {
  if (!isAuthConfigured()) {
    return json(res, 503, { error: "CRM не настроена: не задан CRM_PASSWORD" })
  }

  if (req.method === "GET") {
    return json(res, 200, { authenticated: hasSession(req) })
  }

  if (req.method === "DELETE") {
    clearSessionCookie(req, res)
    return json(res, 200, { ok: true })
  }

  if (req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "POST", "DELETE"])
  }

  if (isLimited(clientIp(req))) {
    return json(res, 429, { error: "Слишком много попыток входа. Попробуйте через несколько минут" })
  }

  const body = readBody(req)
  if (!body) return json(res, 400, { error: "Некорректный запрос" })

  if (!passwordMatches(String(body.password ?? ""))) {
    return json(res, 401, { error: "Неверный пароль" })
  }

  setSessionCookie(req, res, issueToken())
  return json(res, 200, { ok: true })
}
