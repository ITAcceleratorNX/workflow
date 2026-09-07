/**
 * Лиды CRM.
 *
 *   GET   — список с фильтрами, поиском и постраничным выводом (разделы 3-5)
 *   POST  — ручное добавление лида (раздел 13)
 *   PATCH — сохранение карточки лида, id в теле запроса (раздел 6)
 */

import { requireSession } from "../_lib/auth.js"
import { isDatabaseConfigured } from "../_lib/db.js"
import { json, methodNotAllowed, readBody } from "../_lib/http.js"
import { coerceLeadFields, createLead, getLead, listLeads, updateLead } from "../_lib/leads.js"
import { LEAD_FIELD_BY_NAME, requiredFieldsFor } from "../../shared/crm.js"

/**
 * Проверка зависимостей из раздела 10. Считается по итоговому состоянию лида,
 * а не по присланным полям: иначе частичное сохранение обошло бы правило.
 */
function missingRequired(lead) {
  return requiredFieldsFor(lead)
    .filter((name) => {
      const value = lead[name]
      return value === null || value === undefined || value === ""
    })
    .map((name) => LEAD_FIELD_BY_NAME.get(name)?.label ?? name)
}

export default async function handler(req, res) {
  if (!requireSession(req, res)) return

  if (!isDatabaseConfigured()) {
    return json(res, 503, { error: "CRM не настроена: не задан DATABASE_URL" })
  }

  try {
    if (req.method === "GET") {
      const result = await listLeads(req.query ?? {})
      return json(res, 200, result)
    }

    if (req.method === "POST" || req.method === "PATCH") {
      const body = readBody(req)
      if (!body) return json(res, 400, { error: "Некорректный запрос" })

      const { values, errors } = coerceLeadFields(body)
      if (errors.length > 0) return json(res, 400, { error: errors[0] })

      if (req.method === "POST") {
        if (!values.name) return json(res, 400, { error: "Укажите имя контактного лица" })

        const problems = missingRequired(values)
        if (problems.length > 0) {
          return json(res, 400, { error: `Заполните обязательные поля: ${problems.join(", ")}` })
        }

        return json(res, 201, { lead: await createLead(values) })
      }

      const id = Number(body.id)
      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Не указан лид" })

      const current = await getLead(id)
      if (!current) return json(res, 404, { error: "Лид не найден" })

      const problems = missingRequired({ ...current, ...values })
      if (problems.length > 0) {
        return json(res, 400, { error: `Заполните обязательные поля: ${problems.join(", ")}` })
      }

      return json(res, 200, { lead: await updateLead(id, values) })
    }

    return methodNotAllowed(res, ["GET", "POST", "PATCH"])
  } catch (error) {
    console.error("Ошибка CRM /leads", error)
    return json(res, 500, { error: "Не удалось выполнить операцию" })
  }
}
