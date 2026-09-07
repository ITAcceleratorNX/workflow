/**
 * Справочники и схема полей CRM (ТЗ «CRM для сайта TMK WorkFlow», разделы 4-14).
 *
 * Модуль общий для браузера и серверных функций, поэтому это обычный JavaScript:
 * `src/` собирает Vite, `api/` — сборщик Vercel, и общий код должен читаться
 * обоими без отдельного шага компиляции. Литеральные типы TypeScript выводятся
 * из `@type {const}` — см. src/crm/types.ts.
 *
 * Единственный источник правды: значения выпадающих списков в интерфейсе,
 * проверка на сервере и заголовки CSV берутся отсюда и не расходятся.
 */

/** Значение «фильтр не выбран». В запрос к базе не попадает. */
export const ANY = "Все"

/* ------------------------------------------------------------------ */
/* Справочники (разделы 4, 6, 7, 8, 12)                                */
/* ------------------------------------------------------------------ */

/** Три бизнес-центра TMK. Используется там, где нужен фактический объект. */
export const BUILDINGS = /** @type {const} */ (["Time Square", "Venus", "Koktem Towers"])

export const OFFICE_FORMATS = /** @type {const} */ ([
  "Офис",
  "Сервисный офис",
  "Офис под ключ",
  "Коммерческое помещение",
  "Не определился",
])

export const PROPERTY_OPTIONS = /** @type {const} */ ([
  "Time Square",
  "Venus",
  "Koktem Towers",
  "Несколько объектов",
  "Любой подходящий объект",
  "Ищет другой объект / офис",
  "Не определился",
])

export const CLIENT_NEEDS = /** @type {const} */ ([
  "Офис",
  "Сервисный офис",
  "Офис под ключ",
  "Коммерческое помещение",
  "Несколько вариантов",
  "Пока не определился",
])

export const PROCESSING_STATES = /** @type {const} */ ([
  "Не обработан",
  "В работе",
  "Обработан",
  "Закрыт",
])

export const LEAD_STATUSES = /** @type {const} */ ([
  "Новый",
  "Связались",
  "Не дозвонились",
  "Выявление потребности",
  "Предложение отправлено",
  "Просмотр назначен",
  "Просмотр проведён",
  "Переговоры",
  "Договор на согласовании",
  "Сделка",
  "Отложен",
  "Отказ",
  "Нецелевой",
  "Дубль",
])

export const LEAD_QUALITIES = /** @type {const} */ ([
  "Горячий",
  "Тёплый",
  "Холодный",
  "Нецелевой",
  "Дубль",
  "Спам / ошибочная заявка",
])

export const LEAD_OUTCOMES = /** @type {const} */ ([
  "Сделка",
  "В процессе",
  "Отложенный спрос",
  "Потенциальный клиент на будущее",
  "Отказался",
  "Нецелевой",
  "Дубль",
  "Не удалось связаться",
])

export const REJECT_REASONS = /** @type {const} */ ([
  "Высокая стоимость",
  "Не подходит локация",
  "Не подходит площадь",
  "Не подходит планировка",
  "Не подходит класс БЦ",
  "Не подходят условия аренды",
  "Не хватает парковки",
  "Не подходит дата заезда",
  "Не подходит срок аренды",
  "Выбрал другой объект TMK",
  "Нашёл объект у другого арендодателя",
  "Передумал / отложил переезд",
  "Не удалось связаться",
  "Ошибочная заявка",
  "Другое",
])

export const LEASE_TERMS = /** @type {const} */ ([
  "До 6 месяцев",
  "6-12 месяцев",
  "1-3 года",
  "Более 3 лет",
  "Не определён",
])

export const BUILDING_CLASSES = /** @type {const} */ (["A", "B+", "Не принципиально"])

export const REQUIREMENTS = /** @type {const} */ ([
  "Парковка",
  "Готовый ремонт",
  "Open space",
  "Кабинетная планировка",
  "Переговорные",
  "Отдельный вход",
  "Первый этаж",
  "Высокая проходимость",
  "Возможность размещения вывески",
  "Мебель",
  "Интернет / готовая инфраструктура",
  "Другое",
])

export const NEXT_ACTIONS = /** @type {const} */ ([
  "Позвонить",
  "Написать в WhatsApp",
  "Отправить подборку",
  "Отправить коммерческое предложение",
  "Назначить просмотр",
  "Повторный контакт",
  "Подготовить документы",
  "Дождаться решения клиента",
  "Другое",
])

/**
 * Ответственные менеджеры. В ТЗ помечены как «предоставляется отдельно» —
 * до передачи списка здесь заглушка. Правится только этот массив: он
 * одновременно наполняет фильтр на главном экране и выбор в карточке лида.
 */
export const MANAGERS = /** @type {const} */ ([
  "Ерлепесов Тимур",
  "Менеджер 2",
  "Менеджер 3",
])

/* ------------------------------------------------------------------ */
/* Значения, на которые завязана логика (раздел 10)                     */
/* ------------------------------------------------------------------ */

export const STATUS = /** @type {const} */ ({
  NEW: "Новый",
  VIEWING_SCHEDULED: "Просмотр назначен",
  VIEWING_DONE: "Просмотр проведён",
  DEAL: "Сделка",
  REJECTED: "Отказ",
})

export const PROCESSING = /** @type {const} */ ({
  NEW: "Не обработан",
  IN_WORK: "В работе",
  DONE: "Обработан",
  CLOSED: "Закрыт",
})

/** Вариант «Интересующий объект», раскрывающий поле «Желаемая локация». */
export const PROPERTY_OTHER = "Ищет другой объект / офис"

/** Откуда пришёл лид. Заявка с сайта или ручное добавление (раздел 13). */
export const SOURCES = /** @type {const} */ ({
  SITE: "site",
  MANUAL: "manual",
})

export const SOURCE_LABELS = /** @type {const} */ ({
  site: "Заявка с сайта",
  manual: "Ручное добавление",
})

/* ------------------------------------------------------------------ */
/* Схема полей лида                                                     */
/* ------------------------------------------------------------------ */

/**
 * Описание всех редактируемых полей лида.
 *
 * `type` определяет и приведение значения на сервере, и колонку в базе:
 *   text   — строка, обрезается до `max`
 *   enum   — строка строго из `options`
 *   free   — строка из `options`, но чужое значение тоже сохраняется
 *            (список менеджеров может измениться, старые лиды должны сохраняться)
 *   number — дробное число (площадь, суммы)
 *   int    — целое число
 *   date   — ГГГГ-ММ-ДД
 *   time   — ЧЧ:ММ
 *   multi  — массив значений из `options`
 *
 * `label` используется как заголовок колонки в выгрузке CSV (раздел 14).
 * Порядок массива задаёт порядок колонок в CSV.
 */
export const LEAD_FIELDS = [
  /* 6.1. Данные заявки */
  { name: "name", label: "Имя", type: "text", max: 120 },
  { name: "company", label: "Компания", type: "text", max: 160 },
  { name: "contact_role", label: "Должность / роль", type: "text", max: 120 },
  { name: "phone", label: "Телефон", type: "text", max: 32 },
  { name: "email", label: "Email", type: "text", max: 160 },
  { name: "property", label: "Интересующий объект", type: "enum", options: PROPERTY_OPTIONS },
  { name: "office_format", label: "Формат офиса", type: "enum", options: OFFICE_FORMATS },
  { name: "form_comment", label: "Комментарий из формы", type: "text", max: 2000 },
  { name: "page", label: "Страница заявки", type: "text", max: 300 },
  { name: "source_label", label: "Источник заявки", type: "text", max: 200 },

  /* 6.2. Обработка лида */
  { name: "processing", label: "Обработка", type: "enum", options: PROCESSING_STATES },
  { name: "manager", label: "Ответственный менеджер", type: "free", options: MANAGERS, max: 120 },
  { name: "status", label: "Статус лида", type: "enum", options: LEAD_STATUSES },
  { name: "quality", label: "Качество лида", type: "enum", options: LEAD_QUALITIES },
  { name: "client_need", label: "Что ищет клиент", type: "enum", options: CLIENT_NEEDS },

  /* 7. Потребность клиента */
  { name: "area_from", label: "Площадь от, м²", type: "number" },
  { name: "area_to", label: "Площадь до, м²", type: "number" },
  { name: "employees", label: "Количество сотрудников", type: "int" },
  { name: "budget_month", label: "Бюджет в месяц, ₸", type: "number" },
  { name: "rate_per_sqm", label: "Желаемая ставка за м², ₸", type: "number" },
  { name: "move_in_date", label: "Желаемая дата заезда", type: "date" },
  { name: "lease_term", label: "Срок аренды", type: "enum", options: LEASE_TERMS },
  { name: "building_class", label: "Класс объекта", type: "enum", options: BUILDING_CLASSES },
  { name: "requirements", label: "Требования к помещению", type: "multi", options: REQUIREMENTS },
  { name: "desired_location", label: "Желаемая локация / что ищет", type: "text", max: 500 },

  /* 8. Следующее действие */
  { name: "next_action", label: "Следующее действие", type: "enum", options: NEXT_ACTIONS },
  { name: "next_action_date", label: "Дата следующего действия", type: "date" },
  { name: "next_action_time", label: "Время следующего действия", type: "time" },
  { name: "manager_comment", label: "Комментарий менеджера", type: "text", max: 4000 },

  /* 9. Просмотр объекта */
  { name: "viewing_property", label: "Объект просмотра", type: "enum", options: BUILDINGS },
  { name: "viewing_date", label: "Дата просмотра", type: "date" },
  { name: "viewing_time", label: "Время просмотра", type: "time" },
  { name: "viewing_result", label: "Результат просмотра", type: "text", max: 2000 },

  /* 10-12. Итог работы с лидом */
  { name: "outcome", label: "Итог лида", type: "enum", options: LEAD_OUTCOMES },
  { name: "reject_reason", label: "Причина отказа", type: "enum", options: REJECT_REASONS },

  /* 11. Итог сделки */
  { name: "deal_property", label: "Сделка: объект", type: "enum", options: BUILDINGS },
  { name: "deal_area", label: "Сделка: площадь, м²", type: "number" },
  { name: "deal_rate", label: "Сделка: ставка за м², ₸", type: "number" },
  { name: "deal_rent_month", label: "Сделка: аренда в месяц, ₸", type: "number" },
  { name: "deal_move_in", label: "Сделка: дата заезда", type: "date" },
  { name: "deal_term", label: "Сделка: срок аренды", type: "enum", options: LEASE_TERMS },
]

/** Быстрый доступ к описанию поля по имени. */
export const LEAD_FIELD_BY_NAME = new Map(LEAD_FIELDS.map((field) => [field.name, field]))

/** Поля, которые заполняются автоматически и не приходят из формы карточки. */
export const READONLY_FIELDS = /** @type {const} */ ([
  "id",
  "created_at",
  "updated_at",
  "source",
  "gclid",
  "utm_source",
  "utm_campaign",
  "utm_term",
])

/** Метки рекламы (раздел 15.3). Совпадают с AD_PARAMS в src/lib/attribution.ts. */
export const AD_PARAMS = /** @type {const} */ (["gclid", "utm_source", "utm_campaign", "utm_term"])

/* ------------------------------------------------------------------ */
/* Условная логика полей по статусам (раздел 10)                        */
/* ------------------------------------------------------------------ */

/**
 * Поля, обязательные для выбранного статуса. Возвращает имена полей —
 * одинаково пригодно для подсветки в карточке и для проверки на сервере.
 *
 * @param {{ status?: string | null, property?: string | null }} lead
 * @returns {string[]}
 */
export function requiredFieldsFor(lead) {
  const required = []

  if (lead.status === STATUS.VIEWING_SCHEDULED) {
    required.push("viewing_property", "viewing_date", "viewing_time")
  }
  if (lead.status === STATUS.VIEWING_DONE) {
    required.push("viewing_result")
  }
  if (lead.status === STATUS.REJECTED) {
    required.push("reject_reason")
  }

  return required
}

/** Показывать ли блок просмотра объекта (раздел 9). */
export const showsViewing = (status) =>
  status === STATUS.VIEWING_SCHEDULED || status === STATUS.VIEWING_DONE

/** Показывать ли итоговые параметры сделки (раздел 11). */
export const showsDeal = (status) => status === STATUS.DEAL

/** Показывать ли причину отказа (раздел 12). */
export const showsRejectReason = (status) => status === STATUS.REJECTED

/** Показывать ли свободное поле «Желаемая локация» (раздел 10). */
export const showsDesiredLocation = (property) => property === PROPERTY_OTHER

/**
 * Формат офиса по кнопке, из которой открыта форма на сайте.
 * В форме сайта такого поля нет, но точка входа его достаточно однозначно задаёт.
 *
 * @param {string} source точка открытия формы, см. LEAD_SOURCE_LABELS
 */
export function officeFormatFromSource(source) {
  if (source === "serviced-office") return "Сервисный офис"
  if (source === "hero-select-office") return "Офис"
  return "Не определился"
}
