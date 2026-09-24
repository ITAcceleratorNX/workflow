/**
 * Короткая заявка перед WhatsApp (ТЗ Bankai 23.09.2026):
 * реестр с channel: "whatsapp" + CRM. Письмо не отправляем.
 */

import { createSiteLead } from "./_lib/leads.js"
import { isDatabaseConfigured } from "./_lib/db.js"
import { AD_PARAMS } from "../shared/crm.js"

const registryUrl = () => process.env.LEADS_REGISTRY_URL || ""
const registryToken = () => process.env.LEADS_REGISTRY_TOKEN || ""

const PROPERTIES = ["Time Square", "Venus", "Koktem Towers"]
const PLACEMENTS = ["header", "footer", "viewing"]
const PHONE_PATTERN = /^\+7\d{10}$/

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 8
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

const clean = (value, maxLength = 500) => String(value ?? "").trim().slice(0, maxLength)

const withoutEmpty = (fields) =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value))

function pickAdParams(body) {
  const params = {}
  for (const key of AD_PARAMS) {
    const value = clean(body[key], 300)
    if (value) params[key] = value
  }
  return params
}

async function sendToRegistry(lead, adParams) {
  const url = registryUrl()
  const token = registryToken()
  if (!url || !token) {
    console.warn("LEADS_REGISTRY_URL или LEADS_REGISTRY_TOKEN не заданы — WhatsApp-заявка не ушла")
    return false
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        token,
        ...withoutEmpty({
          channel: "whatsapp",
          phone: lead.phone,
          property: lead.property,
          placement: lead.placement,
          ...adParams,
        }),
      }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || data?.ok === false) {
      console.error("Реестр не принял WhatsApp-заявку", response.status, data?.error ?? "")
      return false
    }
    return true
  } catch (error) {
    console.error("Не удалось отправить WhatsApp-заявку в реестр", error)
    return false
  }
}

async function saveToCrm(lead, adParams) {
  if (!isDatabaseConfigured()) return
  try {
    await createSiteLead(
      {
        name: "WhatsApp",
        phone: lead.phone,
        property: lead.property || null,
        comment: `Канал: WhatsApp · размещение: ${lead.placement}`,
        page: lead.page || null,
        source: "whatsapp",
        sourceLabel: "WhatsApp",
        officeFormat: "Не определился",
      },
      adParams
    )
  } catch (error) {
    console.error("Не удалось создать WhatsApp-лид в CRM", error)
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Метод не поддерживается" })
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body
  if (!body) return res.status(400).json({ error: "Некорректный запрос" })

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown"

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Слишком много заявок подряд. Попробуйте через минуту" })
  }

  const lead = {
    phone: clean(body.phone, 20),
    property: clean(body.property, 60),
    placement: clean(body.placement, 40),
    page: clean(body.page, 200),
  }

  const adParams = pickAdParams(body)

  if (!PHONE_PATTERN.test(lead.phone)) {
    return res.status(400).json({ error: "Некорректный телефон" })
  }
  if (!PLACEMENTS.includes(lead.placement)) {
    return res.status(400).json({ error: "Некорректное размещение кнопки" })
  }
  if (lead.property && !PROPERTIES.includes(lead.property)) {
    return res.status(400).json({ error: "Некорректный объект" })
  }

  const [registered] = await Promise.all([
    sendToRegistry(lead, adParams),
    saveToCrm(lead, adParams),
  ])

  if (!registered) {
    return res.status(502).json({ error: "Не удалось сохранить заявку" })
  }

  return res.status(200).json({ ok: true })
}
