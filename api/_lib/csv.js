/**
 * Выгрузка лидов в CSV (раздел 14 ТЗ).
 *
 * Разделитель — точка с запятой, в начале файла — BOM: в такой связке Excel
 * с русской локалью открывает файл сразу колонками и не ломает кириллицу.
 */

import { AD_PARAMS, LEAD_FIELDS } from "../../shared/crm.js"

const TZ = "Asia/Almaty"

/** Колонки выгрузки: номер, все поля карточки, метки рекламы и служебные даты. */
const COLUMNS = [
  { key: "id", label: "ID" },
  ...LEAD_FIELDS.map(({ name, label, type }) => ({ key: name, label, type })),
  ...AD_PARAMS.map((name) => ({ key: name, label: name.toUpperCase().replace("_", " ") })),
  { key: "created_at", label: "Дата создания", type: "datetime" },
  { key: "updated_at", label: "Дата последнего обновления", type: "datetime" },
]

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("ru-RU", {
        timeZone: TZ,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

function formatCell(column, value) {
  if (value === null || value === undefined) return ""
  if (column.type === "datetime") return formatDateTime(value)
  if (column.type === "multi") return Array.isArray(value) ? value.join(", ") : ""
  return String(value)
}

/** Кавычки удваиваем; разделитель и перевод строки внутри значения требуют кавычек. */
function escape(value) {
  const text = String(value)
  return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function leadsToCsv(rows) {
  const header = COLUMNS.map((column) => escape(column.label)).join(";")

  const lines = rows.map((row) =>
    COLUMNS.map((column) => escape(formatCell(column, row[column.key]))).join(";")
  )

  return `﻿${[header, ...lines].join("\r\n")}\r\n`
}

/** Имя файла с датой выгрузки, чтобы отчёты не перезаписывали друг друга. */
export const csvFileName = () => `tmk-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`
