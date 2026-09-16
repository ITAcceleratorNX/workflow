import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { LeadForm } from "./LeadForm"
import {
  LEAD_MODAL_TITLES,
  LeadFormContext,
  type OpenLeadFormOptions,
} from "../../lib/leadFormContext"
import { EASE, MOTION_OK, gsap, useGSAP } from "../../lib/motion"
import { track } from "../../lib/site"
import { useScrollLock } from "../../lib/smoothScroll"

export function LeadFormProvider({ children }: { children: ReactNode }) {
  /* request живёт до конца анимации закрытия; open - показана форма или уже уезжает */
  const [request, setRequest] = useState<OpenLeadFormOptions | null>(null)
  const [open, setOpen] = useState(false)

  const openLeadForm = useCallback((options: OpenLeadFormOptions) => {
    setRequest(options)
    setOpen(true)
    track("lead_form_open", { source: options.source, property: options.property })
  }, [])

  const closeLeadForm = useCallback(() => setOpen(false), [])
  const handleExited = useCallback(() => setRequest(null), [])

  const value = useMemo(() => ({ openLeadForm, closeLeadForm }), [openLeadForm, closeLeadForm])

  useScrollLock(request !== null)

  return (
    <LeadFormContext.Provider value={value}>
      {children}
      {request &&
        createPortal(
          <LeadDialog request={request} open={open} onClose={closeLeadForm} onExited={handleExited} />,
          document.body
        )}
    </LeadFormContext.Provider>
  )
}

interface LeadDialogProps {
  request: OpenLeadFormOptions
  open: boolean
  onClose: () => void
  onExited: () => void
}

/**
 * Форма заявки в выезжающей панели: справа на широком экране, снизу на телефоне.
 * После закрытия фокус возвращается на кнопку, которой форму открыли.
 */
function LeadDialog({ request, open, onClose, onExited }: LeadDialogProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const copy = LEAD_MODAL_TITLES[request.source]

  useGSAP(
    () => {
      const fromBottom = window.matchMedia("(max-width: 639px)").matches

      timelineRef.current = gsap
        .timeline({ paused: true, onReverseComplete: onExited })
        .fromTo("[data-lead-overlay]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: EASE.outQuart }, 0)
        .fromTo(
          panelRef.current,
          fromBottom ? { yPercent: 100 } : { xPercent: 100 },
          { xPercent: 0, yPercent: 0, duration: 0.9, ease: EASE.outExpo },
          0
        )
        .from("[data-lead-item]", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.06 }, 0.2)
    },
    { scope: rootRef }
  )

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    if (!window.matchMedia(MOTION_OK).matches) {
      if (open) timeline.progress(1)
      else onExited()
      return
    }

    /* Закрытие быстрее открытия - интерфейс отзывается без ожидания */
    if (open) timeline.timeScale(1).play()
    else timeline.timeScale(1.6).reverse()
  }, [open, onExited])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    panelRef.current?.focus({ preventScroll: true })
    return () => previousFocus?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  return (
    /* data-lenis-prevent: колесо прокручивает саму форму, а не остановленную страницу */
    <div ref={rootRef} data-lenis-prevent className="fixed inset-0 z-[90]">
      <div
        data-lead-overlay
        aria-hidden="true"
        onClick={onClose}
        className="invisible absolute inset-0 bg-graphite-950/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        tabIndex={-1}
        className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-ivory-50 text-graphite-950 outline-none sm:left-auto sm:w-full sm:max-w-xl"
      >
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-graphite-950/10 bg-ivory-50/90 px-6 backdrop-blur-md sm:h-20 sm:px-10">
          <p className="label text-ochre-700">TMK WorkFlow</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть форму"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-graphite-950/15 transition-colors duration-400 hover:border-graphite-950/40 hover:bg-graphite-950/[0.04]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 px-6 pb-10 pt-8 sm:px-10 sm:pt-12">
          <h2 data-lead-item id="lead-modal-title" className="text-display-md font-medium">
            {copy.title}
          </h2>
          <p data-lead-item className="mt-4 text-lead text-graphite-600">
            {copy.description}
          </p>
          <div data-lead-item className="mt-10">
            <LeadForm
              key={`${request.source}-${request.property ?? ""}`}
              source={request.source}
              defaultProperty={request.property}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
