/**
 * Редактируемая часть лида. Вынесена из компонента карточки отдельным модулем:
 * файл с компонентами должен экспортировать только компоненты.
 */

import { PROCESSING, STATUS } from "@shared/crm.js"
import type { Lead, LeadDraft } from "./types"

/** Новый лид открывается в начале воронки — менеджеру не нужно это выбирать. */
export function emptyDraft(): LeadDraft {
  return {
    name: "",
    company: null,
    contact_role: null,
    phone: null,
    email: null,
    property: null,
    office_format: null,
    form_comment: null,
    page: null,
    source_label: null,
    processing: PROCESSING.NEW,
    manager: null,
    status: STATUS.NEW,
    quality: null,
    client_need: null,
    area_from: null,
    area_to: null,
    employees: null,
    budget_month: null,
    rate_per_sqm: null,
    move_in_date: null,
    lease_term: null,
    building_class: null,
    requirements: [],
    desired_location: null,
    next_action: null,
    next_action_date: null,
    next_action_time: null,
    manager_comment: null,
    viewing_property: null,
    viewing_date: null,
    viewing_time: null,
    viewing_result: null,
    outcome: null,
    reject_reason: null,
    deal_property: null,
    deal_area: null,
    deal_rate: null,
    deal_rent_month: null,
    deal_move_in: null,
    deal_term: null,
  }
}

/**
 * Забирает из лида только редактируемые поля. Набор ключей берётся из emptyDraft,
 * поэтому новое поле достаточно добавить в одном месте: служебные колонки,
 * метки рекламы и идентификатор в карточку не попадут.
 */
export function draftFrom(lead: Lead): LeadDraft {
  const draft = emptyDraft()

  for (const key of Object.keys(draft) as Array<keyof LeadDraft>) {
    const value = lead[key]
    if (value !== undefined && value !== null) {
      ;(draft as Record<string, unknown>)[key] = value
    }
  }

  return draft
}
