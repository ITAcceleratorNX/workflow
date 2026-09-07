/**
 * Выгрузка лидов в CSV (раздел 14 ТЗ).
 * Принимает те же параметры фильтрации, что и список, — выгрузка всегда
 * повторяет то, что менеджер видит на главном экране.
 */

import { requireSession } from "../_lib/auth.js"
import { isDatabaseConfigured } from "../_lib/db.js"
import { json, methodNotAllowed } from "../_lib/http.js"
import { csvFileName, leadsToCsv } from "../_lib/csv.js"
import { listLeads } from "../_lib/leads.js"

export default async function handler(req, res) {
  if (!requireSession(req, res)) return
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"])

  if (!isDatabaseConfigured()) {
    return json(res, 503, { error: "CRM не настроена: не задан DATABASE_URL" })
  }

  try {
    const { rows } = await listLeads(req.query ?? {}, { all: true })

    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader("Content-Disposition", `attachment; filename="${csvFileName()}"`)
    res.setHeader("Cache-Control", "no-store")
    return res.status(200).send(leadsToCsv(rows))
  } catch (error) {
    console.error("Ошибка выгрузки CSV", error)
    return json(res, 500, { error: "Не удалось выгрузить лиды" })
  }
}
