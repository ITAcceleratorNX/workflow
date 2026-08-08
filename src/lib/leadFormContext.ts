import { createContext, useContext } from "react"
import type { LeadSource } from "./leadForm"

export interface OpenLeadFormOptions {
  source: LeadSource
  /** Подставляется автоматически на странице конкретного объекта */
  property?: string
}

export interface LeadFormContextValue {
  openLeadForm: (options: OpenLeadFormOptions) => void
  closeLeadForm: () => void
}

export const LeadFormContext = createContext<LeadFormContextValue | null>(null)

export function useLeadForm(): LeadFormContextValue {
  const context = useContext(LeadFormContext)
  if (!context) {
    throw new Error("useLeadForm должен использоваться внутри <LeadFormProvider>")
  }
  return context
}

export const LEAD_MODAL_TITLES: Record<LeadSource, { title: string; description: string }> = {
  "hero-select-office": {
    title: "Подобрать офис",
    description: "Оставьте контакты — подберём подходящие варианты и вернёмся с предложением.",
  },
  "serviced-office": {
    title: "Подобрать сервисный офис",
    description: "Расскажем о свободных сервисных пространствах и условиях заезда.",
  },
  viewing: {
    title: "Записаться на просмотр",
    description: "Согласуем удобное время и покажем свободные помещения.",
  },
  "header-contact": {
    title: "Связаться с нами",
    description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
  },
  "property-contact": {
    title: "Связаться с нами",
    description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
  },
  "footer-contact": {
    title: "Связаться с нами",
    description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
  },
}
