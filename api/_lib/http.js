/** Мелкие помощники для серверных функций CRM: тело запроса, ответы, IP, лимиты. */

/** Vercel парсит JSON сам, но при нестандартном Content-Type тело приходит строкой. */
export function readBody(req) {
  if (!req.body) return {}
  if (typeof req.body !== "string") return req.body
  try {
    return JSON.parse(req.body)
  } catch {
    return null
  }
}

export const json = (res, status, payload) => res.status(status).json(payload)

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "))
  return json(res, 405, { error: "Метод не поддерживается" })
}

export const clientIp = (req) =>
  (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown"

/**
 * Ограничение частоты по ключу. В serverless счётчик живёт в пределах тёплого
 * инстанса — от подбора пароля перебором этого достаточно, а как строгую
 * гарантию его никто и не использует.
 */
export function createRateLimiter({ windowMs, max }) {
  const hits = new Map()

  return function isLimited(key) {
    const now = Date.now()
    const record = hits.get(key)

    if (!record || now - record.start > windowMs) {
      hits.set(key, { start: now, count: 1 })
      return false
    }

    record.count += 1
    return record.count > max
  }
}
