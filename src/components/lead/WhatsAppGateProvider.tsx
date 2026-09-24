import { useCallback, useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation } from "react-router-dom"
import { CircleAlert, X } from "lucide-react"
import { Button, LinkButton } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { cn } from "../../lib/utils"
import { readAdParams } from "../../lib/attribution"
import {
  formatPhoneDigits,
  normalizePhoneDigits,
  PHONE_DIGITS,
  PHONE_PLACEHOLDER,
  toE164,
} from "../../lib/leadForm"
import { track } from "../../lib/site"
import {
  hasSentWhatsAppPhone,
  markWhatsAppPhoneSent,
  openWhatsApp,
  propertyFromPath,
  submitWhatsAppLead,
  whatsappHrefFor,
  type OpenWhatsAppGateOptions,
} from "../../lib/whatsappGate"
import { WhatsAppGateContext, type WhatsAppGateContextValue } from "../../lib/whatsappGateContext"

type GateStatus = "form" | "submitting" | "done"

export function WhatsAppGateProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [request, setRequest] = useState<OpenWhatsAppGateOptions | null>(null)
  const [status, setStatus] = useState<GateStatus>("form")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [waHref, setWaHref] = useState("")
  const uid = useId()

  const resetForm = () => {
    setStatus("form")
    setPhone("")
    setError("")
    setWaHref("")
  }

  const closeWhatsAppGate = useCallback(() => {
    setRequest(null)
    resetForm()
  }, [])

  const openWhatsAppGate = useCallback(
    (options: OpenWhatsAppGateOptions) => {
      const property = options.property ?? propertyFromPath(pathname)
      const href = whatsappHrefFor(property, readAdParams().gclid)

      track("whatsapp_click", {
        placement: options.placement,
        property: property || "home",
      })

      if (hasSentWhatsAppPhone()) {
        openWhatsApp(href)
        return
      }

      setRequest({ ...options, property })
      resetForm()
      setWaHref(href)
    },
    [pathname]
  )

  const value = useMemo<WhatsAppGateContextValue>(
    () => ({ openWhatsAppGate, closeWhatsAppGate }),
    [openWhatsAppGate, closeWhatsAppGate]
  )

  useEffect(() => {
    if (!request) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWhatsAppGate()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [request, closeWhatsAppGate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!request || status === "submitting") return

    if (phone.length < PHONE_DIGITS) {
      setError("Введите номер полностью: +7 (___) ___-__-__")
      return
    }

    const property = request.property ?? ""
    const href = whatsappHrefFor(property, readAdParams().gclid)
    setWaHref(href)
    setStatus("submitting")
    setError("")

    const result = await submitWhatsAppLead({
      phone: toE164(phone),
      property,
      placement: request.placement,
      page: pathname,
    })

    markWhatsAppPhoneSent()
    setStatus("done")

    if (result.ok) {
      track("whatsapp_form_submit", {
        property: property || undefined,
        placement: request.placement,
      })
    }

    openWhatsApp(href)
  }

  return (
    <WhatsAppGateContext.Provider value={value}>
      {children}
      {request &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-brand-900/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={closeWhatsAppGate}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-gate-title"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-float outline-none sm:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 id="whatsapp-gate-title" className="text-xl font-bold text-brand-900 sm:text-2xl">
                    Оставьте телефон, чтобы связаться в WhatsApp
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted sm:text-base">
                    Мы откроем WhatsApp после отправки телефона
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeWhatsAppGate}
                  aria-label="Закрыть"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {status === "done" ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Если WhatsApp не открылся автоматически, нажмите кнопку ниже.
                  </p>
                  <LinkButton
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    className="w-full"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-white" />
                    Открыть WhatsApp
                  </LinkButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-800" htmlFor={uid}>
                      Телефон <span className="text-orange-500">*</span>
                    </label>
                    <div
                      className={cn(
                        "flex w-full items-center gap-1 rounded-xl border bg-white px-3 py-0 outline-none transition",
                        "focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/25",
                        error ? "border-red-400" : "border-brand-200"
                      )}
                    >
                      <span className="select-none pl-1 text-[15px] font-medium text-brand-700">+7</span>
                      <input
                        id={uid}
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        autoFocus
                        value={formatPhoneDigits(phone)}
                        onChange={(event) => {
                          setPhone(normalizePhoneDigits(event.target.value))
                          if (error) setError("")
                        }}
                        className="w-full border-0 bg-transparent py-3 text-[15px] text-brand-900 outline-none placeholder:text-ink-soft"
                        placeholder={PHONE_PLACEHOLDER}
                        maxLength={PHONE_PLACEHOLDER.length + 2}
                        aria-invalid={Boolean(error)}
                      />
                    </div>
                    {error && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
                        <CircleAlert className="h-4 w-4 shrink-0" />
                        {error}
                      </p>
                    )}
                  </div>

                  <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full">
                    {status === "submitting" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Отправляем…
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon className="h-5 w-5" />
                        Перейти в WhatsApp
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs leading-snug text-ink-soft">
                    Нажимая кнопку, вы соглашаетесь на{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                      className="underline underline-offset-2 hover:text-orange-600"
                    >
                      обработку персональных данных
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </WhatsAppGateContext.Provider>
  )
}
