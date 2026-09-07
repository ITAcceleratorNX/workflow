/**
 * Типы CRM. Все перечисления выводятся из общего справочника shared/crm.js,
 * поэтому список значений нигде не дублируется: добавили статус в справочник —
 * TypeScript сразу знает о нём и в таблице, и в карточке лида.
 */

import type {
  BUILDING_CLASSES,
  BUILDINGS,
  CLIENT_NEEDS,
  LEAD_OUTCOMES,
  LEAD_QUALITIES,
  LEAD_STATUSES,
  LEASE_TERMS,
  NEXT_ACTIONS,
  OFFICE_FORMATS,
  PROCESSING_STATES,
  PROPERTY_OPTIONS,
  REJECT_REASONS,
  REQUIREMENTS,
} from "@shared/crm.js"

export type Building = (typeof BUILDINGS)[number]
export type BuildingClass = (typeof BUILDING_CLASSES)[number]
export type ClientNeed = (typeof CLIENT_NEEDS)[number]
export type LeadOutcome = (typeof LEAD_OUTCOMES)[number]
export type LeadQuality = (typeof LEAD_QUALITIES)[number]
export type LeadStatus = (typeof LEAD_STATUSES)[number]
export type LeaseTerm = (typeof LEASE_TERMS)[number]
export type NextAction = (typeof NEXT_ACTIONS)[number]
export type OfficeFormat = (typeof OFFICE_FORMATS)[number]
export type ProcessingState = (typeof PROCESSING_STATES)[number]
export type PropertyOption = (typeof PROPERTY_OPTIONS)[number]
export type RejectReason = (typeof REJECT_REASONS)[number]
export type Requirement = (typeof REQUIREMENTS)[number]

/** Лид в том виде, в каком его отдаёт /api/crm/leads. */
export interface Lead {
  id: number
  created_at: string
  updated_at: string

  /* 6.1. Данные заявки */
  source: "site" | "manual"
  source_label: string | null
  name: string
  company: string | null
  contact_role: string | null
  phone: string | null
  email: string | null
  property: PropertyOption | null
  office_format: OfficeFormat | null
  form_comment: string | null
  page: string | null
  gclid: string | null
  utm_source: string | null
  utm_campaign: string | null
  utm_term: string | null

  /* 6.2. Обработка лида */
  processing: ProcessingState
  manager: string | null
  status: LeadStatus
  quality: LeadQuality | null
  client_need: ClientNeed | null

  /* 7. Потребность клиента */
  area_from: number | null
  area_to: number | null
  employees: number | null
  budget_month: number | null
  rate_per_sqm: number | null
  move_in_date: string | null
  lease_term: LeaseTerm | null
  building_class: BuildingClass | null
  requirements: Requirement[]
  desired_location: string | null

  /* 8. Следующее действие */
  next_action: NextAction | null
  next_action_date: string | null
  next_action_time: string | null
  manager_comment: string | null

  /* 9. Просмотр объекта */
  viewing_property: Building | null
  viewing_date: string | null
  viewing_time: string | null
  viewing_result: string | null

  /* 10-12. Итог работы с лидом */
  outcome: LeadOutcome | null
  reject_reason: RejectReason | null

  /* 11. Итог сделки */
  deal_property: Building | null
  deal_area: number | null
  deal_rate: number | null
  deal_rent_month: number | null
  deal_move_in: string | null
  deal_term: LeaseTerm | null
}

/** Редактируемая часть лида: всё, кроме служебных полей и меток рекламы. */
export type LeadDraft = Omit<
  Lead,
  "id" | "created_at" | "updated_at" | "source" | "gclid" | "utm_source" | "utm_campaign" | "utm_term"
>

/** Состояние панели фильтров главного экрана (раздел 4 ТЗ). */
export interface LeadFilters {
  q: string
  office_format: string
  property: string
  client_need: string
  processing: string
  status: string
  quality: string
  outcome: string
  reject_reason: string
  manager: string
  date_from: string
  date_to: string
}

export interface LeadsPage {
  rows: Lead[]
  total: number
  page: number
  pageSize: number
}

export type SortColumn = "created_at" | "updated_at" | "name" | "company" | "status" | "processing" | "manager"

export interface SortState {
  column: SortColumn
  order: "asc" | "desc"
}
