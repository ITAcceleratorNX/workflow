/**
 * Вход в CRM по одному общему паролю без логина (раздел 16 ТЗ).
 *
 * Переменные окружения:
 *   CRM_PASSWORD       — обязательный, общий пароль. Выдаётся заказчиком.
 *   CRM_SESSION_SECRET — необязательный, ключ подписи сессии.
 *
 * Пароль не попадает в cookie. В cookie лежит только срок действия и подпись
 * HMAC-SHA256. Если ключ подписи не задан, он выводится из пароля: тогда смена
 * пароля автоматически обесценивает все выданные сессии.
 */

import crypto from "node:crypto"

const COOKIE_NAME = "crm_session"
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

const password = () => process.env.CRM_PASSWORD || ""

/** CRM без пароля не запускается: иначе она открыта всему интернету. */
export const isAuthConfigured = () => Boolean(password())

const signingKey = () =>
  process.env.CRM_SESSION_SECRET || crypto.createHash("sha256").update(`crm:${password()}`).digest("hex")

const base64url = (value) => Buffer.from(value).toString("base64url")

const sign = (payload) => crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url")

/** Сравнение постоянного времени: длину строк сначала выравниваем хешем. */
function equals(a, b) {
  const left = crypto.createHash("sha256").update(String(a)).digest()
  const right = crypto.createHash("sha256").update(String(b)).digest()
  return crypto.timingSafeEqual(left, right)
}

export const passwordMatches = (input) => Boolean(input) && equals(input, password())

export function issueToken() {
  const payload = base64url(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  return `${payload}.${sign(payload)}`
}

function isTokenValid(token) {
  if (typeof token !== "string") return false

  const separator = token.lastIndexOf(".")
  if (separator === -1) return false

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!equals(signature, sign(payload))) return false

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return typeof exp === "number" && exp > Date.now()
  } catch {
    return false
  }
}

function readCookie(req, name) {
  const header = req.headers.cookie
  if (!header) return ""

  for (const part of header.split(";")) {
    const entry = part.trim()
    const separator = entry.indexOf("=")
    if (separator !== -1 && entry.slice(0, separator) === name) {
      return decodeURIComponent(entry.slice(separator + 1))
    }
  }
  return ""
}

export const hasSession = (req) => isTokenValid(readCookie(req, COOKIE_NAME))

/* На Vercel всё идёт по HTTPS; локально под http флаг Secure отбросил бы cookie. */
const isSecure = (req) =>
  req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production"

function buildCookie(req, value, maxAgeSeconds) {
  return [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    isSecure(req) ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ")
}

export function setSessionCookie(req, res, token) {
  res.setHeader("Set-Cookie", buildCookie(req, token, Math.floor(SESSION_TTL_MS / 1000)))
}

export function clearSessionCookie(req, res) {
  res.setHeader("Set-Cookie", buildCookie(req, "", 0))
}

/**
 * Пропускает дальше только со свежей сессией. Возвращает признак, а не бросает
 * исключение: вызывающий код просто выходит из обработчика.
 */
export function requireSession(req, res) {
  if (!isAuthConfigured()) {
    res.status(503).json({ error: "CRM не настроена: не задан CRM_PASSWORD" })
    return false
  }
  if (!hasSession(req)) {
    res.status(401).json({ error: "Требуется вход" })
    return false
  }
  return true
}
