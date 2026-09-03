/**
 * Приём заявок с сайта TMK WorkFlow и отправка их на почту (раздел 9.4 ТЗ).
 *
 * Переменные окружения (Vercel → Project Settings → Environment Variables):
 *   RESEND_API_KEY   — обязательный, ключ API resend.com
 *   LEAD_TO_EMAIL    — куда слать заявки (по умолчанию yerlepessov.t@tmk-limited.com)
 *   LEAD_FROM_EMAIL  — отправитель на подтверждённом в Resend домене
 */

/* Читаем окружение в момент запроса, а не при загрузке модуля:
   иначе значение фиксируется раньше, чем окружение успевает настроиться. */
const toEmail = () => process.env.LEAD_TO_EMAIL || "yerlepessov.t@tmk-limited.com"
const fromEmail = () => process.env.LEAD_FROM_EMAIL || "TMK WorkFlow <noreply@tmk-workflow.kz>"

const PROPERTIES = ["Time Square", "Venus", "Koktem Towers"]
const PHONE_PATTERN = /^\+7\d{10}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
/* Зеркало MIN_FILL_MS в src/lib/leadForm.ts — менять значения вместе */
const MIN_FILL_MS = 3000

/* Простое ограничение частоты по IP. В serverless живёт в пределах тёплого инстанса. */
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const hits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const record = hits.get(ip)

  if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 })
    return false
  }

  record.count += 1
  return record.count > RATE_LIMIT_MAX
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

const clean = (value, maxLength = 500) => String(value ?? "").trim().slice(0, maxLength)

const leadRows = (lead) => [
  ["Объект", lead.property],
  ["Имя", lead.name],
  ["Компания", lead.company || "—"],
  ["Телефон", lead.phone],
  ["Email", lead.email || "—"],
  ["Комментарий", lead.comment || "—"],
  ["Страница", lead.page || "—"],
  ["Источник формы", lead.sourceLabel || lead.source || "—"],
]

const receivedAt = () =>
  new Date().toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })

/** Текстовая версия письма: без неё почтовые фильтры занижают HTML-only письма */
function buildEmailText(lead) {
  return [
    `Заявка с сайта tmk-workflow.kz`,
    "",
    ...leadRows(lead).map(([label, value]) => `${label}: ${value}`),
    "",
    `Получено: ${receivedAt()} (Алматы)`,
  ].join("\n")
}

function buildEmailHtml(lead) {
  const rows = leadRows(lead)

  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #E3F1FB;color:#587487;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #E3F1FB;color:#0E3552;font-size:15px;font-weight:600;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`
    )
    .join("")

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Заявка с сайта tmk-workflow.kz</title>
  </head>
  <body style="margin:0;padding:24px;background:#F3F9FE;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border-collapse:collapse;width:100%;">
      <tr>
        <td style="padding:24px;background:#0E3552;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#93CBEE;">Заявка с сайта tmk-workflow.kz</div>
          <div style="margin-top:8px;font-size:22px;font-weight:700;">${escapeHtml(lead.property)}</div>
        </td>
      </tr>
      <tr><td><table role="presentation" style="width:100%;border-collapse:collapse;">${cells}</table></td></tr>
      <tr>
        <td style="padding:16px 24px;color:#8AA0B2;font-size:12px;">
          Получено: ${escapeHtml(receivedAt())} (Алматы)
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Метод не поддерживается" })
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body
  if (!body) return res.status(400).json({ error: "Некорректный запрос" })

  /* Honeypot и слишком быстрая отправка — молча подтверждаем, чтобы не подсказывать боту */
  if (clean(body.website, 100)) return res.status(200).json({ ok: true })
  if (Number(body.elapsedMs) < MIN_FILL_MS) return res.status(200).json({ ok: true })

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown"

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Слишком много заявок подряд. Попробуйте через минуту" })
  }

  const lead = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 20),
    email: clean(body.email, 160),
    comment: clean(body.comment, 2000),
    property: clean(body.property, 60),
    page: clean(body.page, 200),
    source: clean(body.source, 60),
    sourceLabel: clean(body.sourceLabel, 160),
  }

  if (!lead.name) return res.status(400).json({ error: "Укажите имя" })
  if (!PHONE_PATTERN.test(lead.phone)) return res.status(400).json({ error: "Некорректный телефон" })
  if (lead.email && !EMAIL_PATTERN.test(lead.email)) {
    return res.status(400).json({ error: "Некорректный email" })
  }
  if (!PROPERTIES.includes(lead.property)) {
    return res.status(400).json({ error: "Выберите объект из списка" })
  }
  if (body.consent !== true) {
    return res.status(400).json({ error: "Требуется согласие на обработку персональных данных" })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY не задан — заявка не отправлена", lead)
    return res.status(500).json({ error: "Сервис отправки временно недоступен" })
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail(),
        to: [toEmail()],
        reply_to: lead.email || undefined,
        subject: `Заявка с сайта — ${lead.property} — ${lead.name}`,
        text: buildEmailText(lead),
        html: buildEmailHtml(lead),
        /* Уникальный идентификатор не даёт Gmail схлопывать похожие заявки в одну */
        headers: { "X-Entity-Ref-ID": crypto.randomUUID() },
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error("Resend вернул ошибку", response.status, details)
      return res.status(502).json({ error: "Не удалось отправить заявку" })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error("Ошибка отправки заявки", error)
    return res.status(502).json({ error: "Не удалось отправить заявку" })
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
