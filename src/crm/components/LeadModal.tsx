import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Loader2, X } from "lucide-react"
import {
  BUILDINGS,
  BUILDING_CLASSES,
  CLIENT_NEEDS,
  LEAD_OUTCOMES,
  LEAD_QUALITIES,
  LEAD_STATUSES,
  LEASE_TERMS,
  MANAGERS,
  NEXT_ACTIONS,
  OFFICE_FORMATS,
  PROCESSING,
  PROCESSING_STATES,
  PROPERTY_OPTIONS,
  REJECT_REASONS,
  REQUIREMENTS,
  STATUS,
  requiredFieldsFor,
  showsDeal,
  showsDesiredLocation,
  showsRejectReason,
  showsViewing,
} from "@shared/crm.js"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import { ChipsInput, Field, FieldBlock, NumberInput, SelectInput, TextArea, TextInput } from "./fields"
import { ProcessingBadge, QualityBadge, StatusBadge } from "./Badges"
import { dash, formatDateTime, formatPhone } from "../format"
import { draftFrom, emptyDraft } from "../leadDraft"
import type { Lead, LeadDraft } from "../types"

interface Section {
  id: string
  title: string
}

/** Куда прокрутить карточку, если поле осталось пустым (раздел 10 ТЗ). */
const SECTION_OF_FIELD: Record<string, string> = {
  name: "request",
  viewing_property: "viewing",
  viewing_date: "viewing",
  viewing_time: "viewing",
  viewing_result: "viewing",
  reject_reason: "outcome",
}

interface LeadModalProps {
  lead: Lead | null
  onClose: () => void
  onSave: (draft: LeadDraft) => Promise<void>
}

export function LeadModal({ lead, onClose, onSave }: LeadModalProps) {
  const initial = useMemo(() => (lead ? draftFrom(lead) : emptyDraft()), [lead])
  const [draft, setDraft] = useState<LeadDraft>(initial)
  const [showErrors, setShowErrors] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft(initial)
    setShowErrors(false)
    setError("")
  }, [initial])

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial])

  /** Закрытие с несохранёнными правками спрашивает подтверждение. */
  const requestClose = useCallback(() => {
    if (dirty && !window.confirm("Изменения не сохранены. Закрыть карточку?")) return
    onClose()
  }, [dirty, onClose])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [requestClose])

  const set = <K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  /* Текстовые поля храним как null, когда они пусты: так же, как в базе */
  const setText = (key: keyof LeadDraft) => (value: string) =>
    setDraft((current) => ({ ...current, [key]: value === "" ? null : value }))

  const required = useMemo(() => new Set(requiredFieldsFor(draft)), [draft])

  /* Порядок важен: первым идёт поле, к которому карточка прокрутится при ошибке */
  const missing = useMemo(() => {
    const empty: string[] = []
    if (!draft.name.trim()) empty.push("name")

    for (const name of required) {
      const value = draft[name as keyof LeadDraft]
      if (value === null || value === undefined || value === "") empty.push(name)
    }

    return new Set(empty)
  }, [required, draft])

  const invalid = (name: keyof LeadDraft) => showErrors && missing.has(name)

  const sections: Section[] = [
    { id: "request", title: "Заявка" },
    { id: "processing", title: "Обработка" },
    { id: "needs", title: "Потребность" },
    { id: "next", title: "Следующее действие" },
    ...(showsViewing(draft.status) ? [{ id: "viewing", title: "Просмотр" }] : []),
    { id: "outcome", title: "Итог" },
    ...(showsDeal(draft.status) ? [{ id: "deal", title: "Сделка" }] : []),
  ]

  const scrollTo = (id: string) => {
    bodyRef.current?.querySelector(`#section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function handleSave() {
    setShowErrors(true)
    setError("")

    if (missing.size > 0) {
      setError("Заполните обязательные поля, отмеченные красным")
      const section = SECTION_OF_FIELD[[...missing][0]]
      if (section) scrollTo(section)
      return
    }

    setSaving(true)
    try {
      await onSave(draft)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить лид")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={lead ? `Лид: ${lead.name}` : "Новый лид"}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-float sm:max-h-[92vh] sm:rounded-3xl"
      >
        <ModalHeader lead={lead} draft={draft} onClose={requestClose} />

        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-brand-100 bg-white px-4 py-2 no-scrollbar sm:px-6">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
            >
              {section.title}
            </button>
          ))}
        </nav>

        <div
          ref={bodyRef}
          /* min-h-0 обязателен: без него флекс не даёт середине сжаться и плющит шапку с подвалом */
          className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-brand-50/40 p-4 sm:p-6"
        >
          {/* 6.1. Данные заявки */}
          <Block id="request" title="Данные заявки" note="Приходят из формы сайта или заполняются вручную">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Имя контактного лица" required error={invalid("name") ? "Обязательное поле" : undefined}>
                <TextInput value={draft.name} onChange={(value) => set("name", value)} invalid={invalid("name")} />
              </Field>
              <Field label="Название компании">
                <TextInput value={draft.company ?? ""} onChange={setText("company")} />
              </Field>
              <Field label="Должность / роль">
                <TextInput value={draft.contact_role ?? ""} onChange={setText("contact_role")} />
              </Field>
              <Field label="Телефон">
                <TextInput type="tel" value={draft.phone ?? ""} onChange={setText("phone")} placeholder="+7 (___) ___-__-__" />
              </Field>
              <Field label="Email">
                <TextInput type="email" value={draft.email ?? ""} onChange={setText("email")} />
              </Field>
              <Field label="Интересующий объект">
                <SelectInput
                  value={draft.property ?? ""}
                  onChange={(value) => set("property", (value || null) as LeadDraft["property"])}
                  options={PROPERTY_OPTIONS}
                />
              </Field>
              <Field label="Формат офиса">
                <SelectInput
                  value={draft.office_format ?? ""}
                  onChange={(value) => set("office_format", (value || null) as LeadDraft["office_format"])}
                  options={OFFICE_FORMATS}
                />
              </Field>
              <Field label="Комментарий из формы" className="sm:col-span-2 lg:col-span-3">
                <TextArea
                  value={draft.form_comment ?? ""}
                  onChange={setText("form_comment")}
                  /* Исходный комментарий клиента менять нельзя (раздел 6.1) */
                  readOnly={Boolean(lead && lead.source === "site")}
                  rows={2}
                />
              </Field>
            </div>

            {lead && <RequestMeta lead={lead} />}
          </Block>

          {/* 6.2. Обработка лида */}
          <Block id="processing" title="Обработка лида">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Обработка">
                <SelectInput
                  value={draft.processing}
                  onChange={(value) => set("processing", (value || PROCESSING.NEW) as LeadDraft["processing"])}
                  options={PROCESSING_STATES}
                  placeholder={PROCESSING.NEW}
                />
              </Field>
              <Field label="Ответственный менеджер">
                <SelectInput
                  value={draft.manager ?? ""}
                  onChange={(value) => set("manager", value || null)}
                  options={MANAGERS}
                />
              </Field>
              <Field label="Статус лида">
                <SelectInput
                  value={draft.status}
                  onChange={(value) => set("status", (value || STATUS.NEW) as LeadDraft["status"])}
                  options={LEAD_STATUSES}
                  placeholder={STATUS.NEW}
                />
              </Field>
              <Field label="Качество лида">
                <SelectInput
                  value={draft.quality ?? ""}
                  onChange={(value) => set("quality", (value || null) as LeadDraft["quality"])}
                  options={LEAD_QUALITIES}
                />
              </Field>
              <Field label="Что ищет клиент">
                <SelectInput
                  value={draft.client_need ?? ""}
                  onChange={(value) => set("client_need", (value || null) as LeadDraft["client_need"])}
                  options={CLIENT_NEEDS}
                />
              </Field>
            </div>
          </Block>

          {/* 7. Потребность клиента */}
          <Block id="needs" title="Потребность клиента" note="Заполняется после контакта с клиентом">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <FieldBlock label="Площадь">
                <div className="flex items-center gap-2">
                  <NumberInput value={draft.area_from} onChange={(value) => set("area_from", value)} placeholder="от" suffix="м²" />
                  <span className="text-ink-soft">—</span>
                  <NumberInput value={draft.area_to} onChange={(value) => set("area_to", value)} placeholder="до" suffix="м²" />
                </div>
              </FieldBlock>
              <Field label="Количество сотрудников">
                <NumberInput value={draft.employees} onChange={(value) => set("employees", value)} step="1" />
              </Field>
              <Field label="Бюджет в месяц">
                <NumberInput value={draft.budget_month} onChange={(value) => set("budget_month", value)} suffix="₸" />
              </Field>
              <Field label="Желаемая ставка за м²">
                <NumberInput value={draft.rate_per_sqm} onChange={(value) => set("rate_per_sqm", value)} suffix="₸" />
              </Field>
              <Field label="Желаемая дата заезда">
                <TextInput type="date" value={draft.move_in_date ?? ""} onChange={setText("move_in_date")} />
              </Field>
              <Field label="Срок аренды">
                <SelectInput
                  value={draft.lease_term ?? ""}
                  onChange={(value) => set("lease_term", (value || null) as LeadDraft["lease_term"])}
                  options={LEASE_TERMS}
                />
              </Field>
              <Field label="Класс объекта">
                <SelectInput
                  value={draft.building_class ?? ""}
                  onChange={(value) => set("building_class", (value || null) as LeadDraft["building_class"])}
                  options={BUILDING_CLASSES}
                />
              </Field>
              <FieldBlock label="Требования к помещению" className="sm:col-span-2 lg:col-span-3">
                <ChipsInput
                  value={draft.requirements}
                  onChange={(value) => set("requirements", value as LeadDraft["requirements"])}
                  options={REQUIREMENTS}
                />
              </FieldBlock>

              {/* Раздел 10: поле раскрывается вариантом «Ищет другой объект / офис» */}
              {showsDesiredLocation(draft.property) && (
                <Field label="Желаемая локация / что ищет" className="sm:col-span-2 lg:col-span-3">
                  <TextArea value={draft.desired_location ?? ""} onChange={setText("desired_location")} rows={2} />
                </Field>
              )}
            </div>
          </Block>

          {/* 8. Следующее действие */}
          <Block id="next" title="Следующее действие">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Следующее действие">
                <SelectInput
                  value={draft.next_action ?? ""}
                  onChange={(value) => set("next_action", (value || null) as LeadDraft["next_action"])}
                  options={NEXT_ACTIONS}
                />
              </Field>
              <Field label="Дата">
                <TextInput type="date" value={draft.next_action_date ?? ""} onChange={setText("next_action_date")} />
              </Field>
              <Field label="Время">
                <TextInput type="time" value={draft.next_action_time ?? ""} onChange={setText("next_action_time")} />
              </Field>
              <Field label="Комментарий менеджера" className="sm:col-span-2 lg:col-span-3">
                <TextArea
                  value={draft.manager_comment ?? ""}
                  onChange={setText("manager_comment")}
                  rows={4}
                  placeholder="Суть разговора, результат контакта, договорённости"
                />
              </Field>
            </div>
          </Block>

          {/* 9. Просмотр объекта */}
          {showsViewing(draft.status) && (
            <Block id="viewing" title="Просмотр объекта" accent>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Объект"
                  required={required.has("viewing_property")}
                  error={invalid("viewing_property") ? "Обязательное поле" : undefined}
                >
                  <SelectInput
                    value={draft.viewing_property ?? ""}
                    onChange={(value) => set("viewing_property", (value || null) as LeadDraft["viewing_property"])}
                    options={BUILDINGS}
                    invalid={invalid("viewing_property")}
                  />
                </Field>
                <Field
                  label="Дата просмотра"
                  required={required.has("viewing_date")}
                  error={invalid("viewing_date") ? "Обязательное поле" : undefined}
                >
                  <TextInput
                    type="date"
                    value={draft.viewing_date ?? ""}
                    onChange={setText("viewing_date")}
                    invalid={invalid("viewing_date")}
                  />
                </Field>
                <Field
                  label="Время просмотра"
                  required={required.has("viewing_time")}
                  error={invalid("viewing_time") ? "Обязательное поле" : undefined}
                >
                  <TextInput
                    type="time"
                    value={draft.viewing_time ?? ""}
                    onChange={setText("viewing_time")}
                    invalid={invalid("viewing_time")}
                  />
                </Field>
                <Field
                  label="Комментарий по результату просмотра"
                  required={required.has("viewing_result")}
                  error={invalid("viewing_result") ? "Обязательное поле" : undefined}
                  className="sm:col-span-2 lg:col-span-3"
                >
                  <TextArea
                    value={draft.viewing_result ?? ""}
                    onChange={setText("viewing_result")}
                    rows={3}
                    invalid={invalid("viewing_result")}
                  />
                </Field>
              </div>
            </Block>
          )}

          {/* 10-12. Итог работы с лидом */}
          <Block id="outcome" title="Итог работы с лидом">
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Итог лида">
                <SelectInput
                  value={draft.outcome ?? ""}
                  onChange={(value) => set("outcome", (value || null) as LeadDraft["outcome"])}
                  options={LEAD_OUTCOMES}
                />
              </Field>
              {showsRejectReason(draft.status) && (
                <Field
                  label="Причина отказа"
                  required
                  error={invalid("reject_reason") ? "Обязательное поле" : undefined}
                  className="sm:col-span-2"
                >
                  <SelectInput
                    value={draft.reject_reason ?? ""}
                    onChange={(value) => set("reject_reason", (value || null) as LeadDraft["reject_reason"])}
                    options={REJECT_REASONS}
                    invalid={invalid("reject_reason")}
                  />
                </Field>
              )}
            </div>
          </Block>

          {/* 11. Итог сделки */}
          {showsDeal(draft.status) && (
            <Block id="deal" title="Итог сделки" note="Фактические параметры закрытой сделки" accent>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Объект">
                  <SelectInput
                    value={draft.deal_property ?? ""}
                    onChange={(value) => set("deal_property", (value || null) as LeadDraft["deal_property"])}
                    options={BUILDINGS}
                  />
                </Field>
                <Field label="Площадь">
                  <NumberInput value={draft.deal_area} onChange={(value) => set("deal_area", value)} suffix="м²" />
                </Field>
                <Field label="Итоговая ставка за м²">
                  <NumberInput value={draft.deal_rate} onChange={(value) => set("deal_rate", value)} suffix="₸" />
                </Field>
                <Field label="Итоговая аренда в месяц">
                  <NumberInput
                    value={draft.deal_rent_month}
                    onChange={(value) => set("deal_rent_month", value)}
                    suffix="₸"
                  />
                </Field>
                <Field label="Дата заезда">
                  <TextInput type="date" value={draft.deal_move_in ?? ""} onChange={setText("deal_move_in")} />
                </Field>
                <Field label="Срок аренды">
                  <SelectInput
                    value={draft.deal_term ?? ""}
                    onChange={(value) => set("deal_term", (value || null) as LeadDraft["deal_term"])}
                    options={LEASE_TERMS}
                  />
                </Field>
              </div>
            </Block>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-brand-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p
            role={error ? "alert" : undefined}
            className={cn("text-[13px]", error ? "font-medium text-rose-600" : "text-ink-soft")}
          >
            {error || (dirty ? "Есть несохранённые изменения" : "Все изменения сохранены")}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={requestClose} disabled={saving} className="flex-1 sm:flex-none">
              Закрыть
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Сохраняем" : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalHeader({ lead, draft, onClose }: { lead: Lead | null; draft: LeadDraft; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-100 bg-white px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="eyebrow">{lead ? `Лид № ${lead.id}` : "Новый лид"}</p>
        <h2 className="mt-1 truncate text-xl font-bold text-brand-900">
          {draft.name.trim() || "Без имени"}
          {draft.company && <span className="ml-2 text-base font-medium text-ink-muted">{draft.company}</span>}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ProcessingBadge value={draft.processing} />
          <StatusBadge value={draft.status} />
          {draft.quality && <QualityBadge value={draft.quality} />}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть карточку"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

/** Технические данные заявки: их не редактируют, но менеджеру они нужны. */
function RequestMeta({ lead }: { lead: Lead }) {
  const rows: Array<[string, string]> = [
    ["Дата заявки", formatDateTime(lead.created_at)],
    ["Последнее обновление", formatDateTime(lead.updated_at)],
    ["Источник", dash(lead.source_label)],
    ["Страница заявки", dash(lead.page)],
    ["Телефон для звонка", formatPhone(lead.phone)],
    ["GCLID", dash(lead.gclid)],
    ["utm_source", dash(lead.utm_source)],
    ["utm_campaign", dash(lead.utm_campaign)],
    ["utm_term", dash(lead.utm_term)],
  ]

  return (
    <details className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
      <summary className="cursor-pointer select-none text-[13px] font-semibold text-brand-800">
        Технические параметры заявки
      </summary>
      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[12px] uppercase tracking-wide text-ink-soft">{label}</dt>
            <dd className="truncate text-[13px] font-medium text-ink" title={value}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  )
}

function Block({
  id,
  title,
  note,
  accent,
  children,
}: {
  id: string
  title: string
  note?: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={`section-${id}`}
      className={cn(
        "scroll-mt-4 rounded-2xl border bg-white p-4 sm:p-5",
        /* Блоки, раскрытые статусом, выделяются рамкой — видно, что появилось новое */
        accent ? "border-orange-200 ring-1 ring-orange-100" : "border-brand-100"
      )}
    >
      <header className="mb-4">
        <h3 className="text-[15px] font-bold text-brand-900">{title}</h3>
        {note && <p className="mt-0.5 text-[13px] text-ink-soft">{note}</p>}
      </header>
      {children}
    </section>
  )
}
