/**
 * Подключение к базе CRM и создание схемы.
 *
 * Переменные окружения (Vercel → Project Settings → Environment Variables):
 *   DATABASE_URL — строка подключения к PostgreSQL. Подходит любой провайдер:
 *                  Neon, Vercel Postgres, Supabase, Railway.
 *
 * Таблица создаётся сама при первом обращении, отдельная миграция не нужна:
 * все выражения идемпотентны, повторный запуск ничего не ломает.
 */

import postgres from "postgres"

let client = null
let schemaReady = null

const connectionString = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

/** База настроена. Без неё CRM отвечает понятной ошибкой, а не падает. */
export const isDatabaseConfigured = () => Boolean(connectionString())

/**
 * Параметры строки подключения, которые понимает сам драйвер.
 *
 * Всё остальное postgres.js отправляет серверу как настройку соединения, и
 * Postgres обрывает подключение с «unrecognized configuration parameter».
 * Строки Neon и Supabase несут параметры libpq (channel_binding, sslrootcert),
 * которых у сервера нет, поэтому лишнее убираем. `options` оставляем: это
 * настоящий параметр запуска, его требуют некоторые провайдеры.
 */
const DRIVER_PARAMS = new Set([
  "sslmode",
  "ssl",
  "sslnegotiation",
  "options",
  "max",
  "max_lifetime",
  "max_pipeline",
  "idle_timeout",
  "connect_timeout",
  "keep_alive",
  "backoff",
  "prepare",
  "fetch_types",
  "publications",
  "debug",
  "target_session_attrs",
])

/**
 * Оставляет в адресе только понятные драйверу параметры.
 * Часть с логином и паролем не трогаем вовсе — режем строку по «?».
 */
function withoutForeignParams(rawUrl) {
  const separator = rawUrl.indexOf("?")
  if (separator === -1) return rawUrl

  const base = rawUrl.slice(0, separator)
  const kept = [...new URLSearchParams(rawUrl.slice(separator + 1))].filter(([key]) =>
    DRIVER_PARAMS.has(key)
  )

  return kept.length > 0 ? `${base}?${new URLSearchParams(kept)}` : base
}

/** Локальная база обычно без TLS, облачная — всегда с ним. */
function needsTls(url) {
  try {
    const host = new URL(url).hostname
    return host !== "localhost" && host !== "127.0.0.1" && host !== "::1"
  } catch {
    return true
  }
}

/**
 * Одно подключение на инстанс функции: serverless держит их десятками,
 * и пул на каждый инстанс быстро упирается в лимит соединений провайдера.
 * `prepare: false` нужен пулерам в режиме транзакций (Supabase, PgBouncer).
 */
export function db() {
  if (client) return client

  const url = connectionString()
  if (!url) throw new Error("DATABASE_URL не задан")

  client = postgres(withoutForeignParams(url), {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    ssl: needsTls(url) ? "require" : false,
    /* «relation already exists, skipping» от идемпотентной схемы — не событие для логов */
    onnotice: () => {},
    types: {
      /* Колонки типа date отдаём строкой «ГГГГ-ММ-ДД». Драйвер по умолчанию
         возвращает Date, и при сериализации в JSON дата уезжает на день
         из-за часового пояса — для даты заезда и просмотра это недопустимо. */
      date: { to: 1082, from: [1082], serialize: (value) => value, parse: (value) => value },
    },
  })

  return client
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS crm_leads (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),

    -- 6.1. Данные заявки
    source            text        NOT NULL DEFAULT 'site',
    source_label      text,
    name              text        NOT NULL DEFAULT '',
    company           text,
    contact_role      text,
    phone             text,
    email             text,
    property          text,
    office_format     text,
    form_comment      text,
    page              text,
    gclid             text,
    utm_source        text,
    utm_campaign      text,
    utm_term          text,

    -- 6.2. Обработка лида
    processing        text        NOT NULL DEFAULT 'Не обработан',
    manager           text,
    status            text        NOT NULL DEFAULT 'Новый',
    quality           text,
    client_need       text,

    -- 7. Потребность клиента
    area_from         numeric,
    area_to           numeric,
    employees         integer,
    budget_month      numeric,
    rate_per_sqm      numeric,
    move_in_date      date,
    lease_term        text,
    building_class    text,
    requirements      text[]      NOT NULL DEFAULT '{}',
    desired_location  text,

    -- 8. Следующее действие
    next_action       text,
    next_action_date  date,
    next_action_time  text,
    manager_comment   text,

    -- 9. Просмотр объекта
    viewing_property  text,
    viewing_date      date,
    viewing_time      text,
    viewing_result    text,

    -- 10-12. Итог работы с лидом
    outcome           text,
    reject_reason     text,

    -- 11. Итог сделки
    deal_property     text,
    deal_area         numeric,
    deal_rate         numeric,
    deal_rent_month   numeric,
    deal_move_in      date,
    deal_term         text
  );

  CREATE INDEX IF NOT EXISTS crm_leads_created_at_idx  ON crm_leads (created_at DESC);
  CREATE INDEX IF NOT EXISTS crm_leads_status_idx      ON crm_leads (status);
  CREATE INDEX IF NOT EXISTS crm_leads_processing_idx  ON crm_leads (processing);
  CREATE INDEX IF NOT EXISTS crm_leads_manager_idx     ON crm_leads (manager);
`

/**
 * Создаёт схему один раз на инстанс функции. Обещание кешируется, поэтому
 * параллельные запросы к тёплому инстансу ждут одну и ту же проверку.
 */
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = db()
      .unsafe(SCHEMA_SQL)
      .simple()
      .catch((error) => {
        /* Иначе неудачная попытка закешируется навсегда до перезапуска инстанса */
        schemaReady = null
        throw error
      })
  }
  return schemaReady
}
