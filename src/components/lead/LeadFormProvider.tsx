import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { LeadForm } from "./LeadForm"
import { LeadFormContext, type OpenLeadFormOptions } from "../../lib/leadFormContext"
import { track } from "../../lib/site"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import type { LeadSource } from "../../lib/leadForm"
import type { Messages } from "../../lib/i18n/messages"

const LEAD_MODAL_KEYS: Record<LeadSource, keyof Messages["leadModal"]> = {
  "hero-select-office": "heroSelect",
  "home-select-office": "homeSelect",
  "serviced-office": "serviced",
  viewing: "viewing",
  "header-contact": "headerContact",
  "property-contact": "propertyContact",
  "footer-contact": "footerContact",
}

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<OpenLeadFormOptions | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const { t } = useLocale()

  const openLeadForm = useCallback((options: OpenLeadFormOptions) => {
    setRequest(options)
    track("lead_form_open", {
      source: options.source,
      property: options.property,
      area: options.area,
    })
  }, [])

  const closeLeadForm = useCallback(() => setRequest(null), [])

  const value = useMemo(() => ({ openLeadForm, closeLeadForm }), [openLeadForm, closeLeadForm])

  useEffect(() => {
    if (!request) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLeadForm()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [request, closeLeadForm])

  const copy = request ? t.leadModal[LEAD_MODAL_KEYS[request.source]] : null

  return (
    <LeadFormContext.Provider value={value}>
      {children}
      {request &&
        copy &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-brand-900/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={closeLeadForm}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-modal-title"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-float outline-none sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 id="lead-modal-title" className="text-2xl sm:text-[28px]">
                    {copy.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted sm:text-base">{copy.description}</p>
                </div>
                <button
                  type="button"
                  onClick={closeLeadForm}
                  aria-label={t.common.closeForm}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <LeadForm
                source={request.source}
                defaultProperty={request.property}
                selectedArea={request.area}
              />
            </div>
          </div>,
          document.body
        )}
    </LeadFormContext.Provider>
  )
}
