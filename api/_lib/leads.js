/**
 * Доступ к лидам CRM: проверка значений, фильтры, чтение и запись.
 *
 * Все проверки опираются на LEAD_FIELDS из shared/crm.js — тот же справочник,
 * из которого интерфейс строит выпадающие списки. Разъехаться они не могут.
 */

import { db, ensureSchema } from "./db.js"
import {
  AD_PARAMS,
  LEAD_FIELDS,
  LEAD_FIELD_BY_NAME,
  PROCESSING,
  SOURCES,
  STATUS,
} from "../../shared/crm.js"

/** Размеры страницы из раздела 3 ТЗ. Чужое значение к базе не уйдёт. */
export const PAGE_SIZES = [10, 25, 50, 100]

/** Колонки, по которым разрешена сортировка. Имя подставляется в SQL, поэтому список закрытый. */
const SORTABLE = new Set(["created_at", "updated_at", "name", "company", "status", "processing", "manager"])

/* ------------------------------------------------------------------ */
/* Приведение значений                                                 */
/* ------------------------------------------------------------------ */

const trimmed = (value) => String(value ?? "").trim()

/** Возвращает готовое значение, null для пустого поля или undefined, если значение неверное. */
function coerceValue(field, raw) {
  if (raw === null || raw === undefined || raw === "") {
    return field.type === "multi" ? [] : null
  }

  switch (field.type) {
    case "text":
    case "free": {
      const value = trimmed(raw).slice(0, field.max ?? 500)
      return value || null
    }

    case "enum": {
      const value = trimmed(raw)
      return field.options.includes(value) ? value : undefined
    }

    case "number":
    case "int": {
      const value = Number(String(raw).replace(",", ".").replace(/\s/g, ""))
      if (!Number.isFinite(value) || value < 0) return undefined
      if (field.type === "int" && !Number.isInteger(value)) return undefined
      return value
    }

    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(trimmed(raw)) ? trimmed(raw) : undefined

    case "time":
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed(raw)) ? trimmed(raw) : undefined

    case "multi": {
      if (!Array.isArray(raw)) return undefined
      const picked = [...new Set(raw.map(trimmed))].filter(Boolean)
      return picked.every((item) => field.options.includes(item)) ? picked : undefined
    }

    default:
      return undefined
  }
}

/**
 * Отбирает из тела запроса только известные поля лида и приводит их к типам базы.
 * Незнакомые ключи отбрасываются молча — это защита от записи в служебные колонки.
 */
export function coerceLeadFields(input) {
  const values = {}
  const errors = []

  for (const [key, raw] of Object.entries(input ?? {})) {
    const field = LEAD_FIELD_BY_NAME.get(key)
    if (!field) continue

    const value = coerceValue(field, raw)
    if (value === undefined) {
      errors.push(`Некорректное значение поля «${field.label}»`)
      continue
    }
    values[key] = value
  }

  return { values, errors }
}

/** Заготовка нового лида: все поля из справочника, чтобы INSERT был предсказуемым. */
function blankLead() {
  const values = {}
  for (const field of LEAD_FIELDS) {
    values[field.name] = field.type === "multi" ? [] : null
  }
  return values
}

/* ------------------------------------------------------------------ */
/* Фильтры главного экрана (раздел 4)                                   */
/* ------------------------------------------------------------------ */

/** Фильтры «равно значению». Ключ запроса совпадает с колонкой. */
const EQUALITY_FILTERS = [
  "office_format",
  "property",
  "client_need",
  "processing",
  "status",
  "quality",
  "outcome",
  "reject_reason",
  "manager",
]

/** Значение фильтра выбрано, а не оставлено в положении «Все». */
const isChosen = (value) => Boolean(value) && value !== "Все"

/** Часовой пояс менеджера: фильтр по дате должен совпадать с датой в таблице. */
const TZ = "Asia/Almaty"

function buildConditions(sql, query) {
  const conditions = []

  for (const key of EQUALITY_FILTERS) {
    const value = trimmed(query[key])
    if (isChosen(value)) conditions.push(sql`${sql(key)} = ${value}`)
  }

  const from = trimmed(query.date_from)
  if (/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    conditions.push(sql`(created_at AT TIME ZONE ${TZ})::date >= ${from}::date`)
  }

  const to = trimmed(query.date_to)
  if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    conditions.push(sql`(created_at AT TIME ZONE ${TZ})::date <= ${to}::date`)
  }

  const search = trimmed(query.q).slice(0, 120)
  if (search) {
    const pattern = `%${search.replace(/[%_\\]/g, (char) => `\\${char}`)}%`
    const digits = search.replace(/\D/g, "")

    /* Телефон хранится как +7XXXXXXXXXX, а ищут его обычно кусками с пробелами */
    const byPhone = digits.length >= 3 ? sql`OR regexp_replace(phone, '\\D', '', 'g') LIKE ${`%${digits}%`}` : sql``

    conditions.push(sql`(
         name             ILIKE ${pattern}
      OR company          ILIKE ${pattern}
      OR contact_role     ILIKE ${pattern}
      OR phone            ILIKE ${pattern}
      OR email            ILIKE ${pattern}
      OR form_comment     ILIKE ${pattern}
      OR manager_comment  ILIKE ${pattern}
      OR desired_location ILIKE ${pattern}
      ${byPhone}
    )`)
  }

  if (conditions.length === 0) return sql``
  return sql`WHERE ${conditions.reduce((all, one) => sql`${all} AND ${one}`)}`
}

/* ------------------------------------------------------------------ */
/* Чтение                                                              */
/* ------------------------------------------------------------------ */

/** numeric приходит из драйвера строкой — интерфейсу нужны числа. */
function toApiLead(row) {
  const lead = { ...row }

  for (const field of LEAD_FIELDS) {
    if (field.type !== "number" && field.type !== "int") continue
    const value = lead[field.name]
    lead[field.name] = value === null || value === undefined ? null : Number(value)
  }

  lead.requirements = lead.requirements ?? []
  return lead
}

/**
 * Список лидов с фильтрами и постраничным выводом.
 * `all: true` отдаёт всю выборку целиком — это режим выгрузки CSV.
 */
export async function listLeads(query, { all = false } = {}) {
  await ensureSchema()
  const sql = db()

  const where = buildConditions(sql, query)

  const sortColumn = SORTABLE.has(trimmed(query.sort)) ? trimmed(query.sort) : "created_at"
  const order = trimmed(query.order).toLowerCase() === "asc" ? sql`ASC` : sql`DESC`
  /* NULLS LAST — пустые значения не должны занимать первые строки при сортировке */
  const orderBy = sql`ORDER BY ${sql(sortColumn)} ${order} NULLS LAST, id DESC`

  if (all) {
    const rows = await sql`SELECT * FROM crm_leads ${where} ${orderBy}`
    return { rows: rows.map(toApiLead), total: rows.length, page: 1, pageSize: rows.length }
  }

  const pageSize = PAGE_SIZES.includes(Number(query.page_size)) ? Number(query.page_size) : 25
  const page = Math.max(1, Number(query.page) || 1)

  /* Счётчик окном: общее число строк приходит вместе со страницей, без второго запроса */
  const rows = await sql`
    SELECT *, count(*) OVER () AS total_count
    FROM crm_leads
    ${where}
    ${orderBy}
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
  `

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0

  return {
    rows: rows.map(({ total_count, ...row }) => toApiLead(row)),
    total,
    page,
    pageSize,
  }
}

/* ------------------------------------------------------------------ */
/* Запись                                                              */
/* ------------------------------------------------------------------ */

/** Ручное добавление лида (раздел 13). */
export async function createLead(values) {
  await ensureSchema()
  const sql = db()

  const row = {
    ...blankLead(),
    ...values,
    source: SOURCES.MANUAL,
    source_label: values.source_label || "Ручное добавление",
    processing: values.processing || PROCESSING.NEW,
    status: values.status || STATUS.NEW,
  }

  const [created] = await sql`
    INSERT INTO crm_leads ${sql(row, ...Object.keys(row))}
    RETURNING *
  `
  return toApiLead(created)
}

export async function updateLead(id, values) {
  await ensureSchema()
  const sql = db()

  if (Object.keys(values).length === 0) return getLead(id)

  const [updated] = await sql`
    UPDATE crm_leads
    SET ${sql(values, ...Object.keys(values))}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return updated ? toApiLead(updated) : null
}

export async function getLead(id) {
  await ensureSchema()
  const sql = db()
  const [row] = await sql`SELECT * FROM crm_leads WHERE id = ${id}`
  return row ? toApiLead(row) : null
}

/**
 * Создаёт лид из заявки с сайта (раздел 15). Вызывается из api/lead.js
 * и никогда не должен ломать отправку формы — ошибки ловит вызывающий код.
 */
export async function createSiteLead(lead, adParams = {}) {
  await ensureSchema()
  const sql = db()

  const row = {
    ...blankLead(),
    source: SOURCES.SITE,
    source_label: lead.sourceLabel || "Заявка с сайта",
    name: lead.name || "",
    company: lead.company || null,
    phone: lead.phone || null,
    email: lead.email || null,
    property: lead.property || null,
    office_format: lead.officeFormat || null,
    form_comment: lead.comment || null,
    page: lead.page || null,
    processing: PROCESSING.NEW,
    status: STATUS.NEW,
  }

  for (const param of AD_PARAMS) {
    row[param] = adParams[param] || null
  }

  const [created] = await sql`INSERT INTO crm_leads ${sql(row, ...Object.keys(row))} RETURNING id`
  return created?.id ?? null
}
