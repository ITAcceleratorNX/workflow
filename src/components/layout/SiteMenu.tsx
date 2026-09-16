import { useEffect, useRef, type RefObject } from "react"
import { NavLink } from "react-router-dom"
import { ArrowUpRight, Mail, Phone } from "lucide-react"
import { Action, ActionAnchor } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { EASE, MOTION_OK, gsap, useGSAP } from "../../lib/motion"
import { CONTACTS, WHATSAPP_DEFAULT_MESSAGE, track, whatsappLink } from "../../lib/site"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"
import { cn } from "../../lib/utils"

interface SiteMenuProps {
  open: boolean
  onClose: () => void
  /** Кнопка меню в шапке: после закрытия фокус возвращается на неё */
  toggleRef: RefObject<HTMLButtonElement | null>
}

/**
 * Полноэкранное меню для телефонов и планшетов.
 * Открывается шторкой сверху вниз, названия объектов выезжают из-под маски.
 */
export function SiteMenu({ open, onClose, toggleRef }: SiteMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const { openLeadForm } = useLeadForm()

  useGSAP(
    () => {
      const menu = menuRef.current
      if (!menu) return

      timelineRef.current = gsap
        .timeline({
          paused: true,
          /* Закрытое меню скрыто полностью, а не только обрезано шторкой */
          onReverseComplete: () => gsap.set(menu, { visibility: "hidden" }),
        })
        .fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.inOutQuart }
        )
        .from("[data-menu-line]", { yPercent: 110, duration: 1, stagger: 0.07 }, 0.35)
        .from("[data-menu-fade]", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.06 }, 0.5)
    },
    { scope: menuRef }
  )

  useEffect(() => {
    const menu = menuRef.current
    const timeline = timelineRef.current
    if (!menu || !timeline) return

    /* Видимость — сразу, до анимации: по элементу с visibility: hidden фокус не ставится */
    if (open) gsap.set(menu, { visibility: "visible" })

    if (window.matchMedia(MOTION_OK).matches) {
      /* Закрытие быстрее открытия — интерфейс отзывается без ожидания */
      if (open) timeline.timeScale(1).play()
      else timeline.timeScale(1.8).reverse()
    } else {
      timeline.pause().progress(open ? 1 : 0)
      if (!open) gsap.set(menu, { visibility: "hidden" })
    }

    if (open) {
      firstLinkRef.current?.focus({ preventScroll: true })
    } else if (menuRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open, toggleRef])

  return (
    <div
      ref={menuRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню сайта"
      inert={!open}
      /* Колесо и тач прокручивают само меню: на низких экранах оно длиннее окна */
      data-lenis-prevent
      className="invisible fixed inset-0 z-40 overflow-y-auto bg-graphite-950 text-ivory-50 lg:hidden"
    >
      <div className="shell flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
        <p data-menu-fade className="label text-ochre-400">
          Бизнес-центры
        </p>

        <ul className="mt-6 border-t border-white/10">
          {PROPERTIES.map((property, index) => (
            <li key={property.slug} className="border-b border-white/10">
              <NavLink
                ref={index === 0 ? firstLinkRef : undefined}
                to={property.path}
                end
                onClick={onClose}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-baseline gap-4">
                      <span className="numeric w-6 text-sm text-graphite-400">0{index + 1}</span>
                      {/* Обёртка — маска: название выезжает снизу из-под неё */}
                      <span className="block overflow-hidden pb-1">
                        <span
                          data-menu-line
                          className={cn(
                            "block whitespace-nowrap text-display-md font-medium transition-colors duration-400",
                            isActive ? "text-ochre-400" : "group-hover:text-ochre-300"
                          )}
                        >
                          {property.name}
                        </span>
                      </span>
                    </span>
                    <span data-menu-fade className="pl-10 text-sm text-graphite-400 sm:pb-2 sm:pl-0 sm:text-right">
                      {property.shortLabel}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-8 pt-12">
          <div data-menu-fade className="space-y-3">
            <a
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "mobile-menu" })}
              className="numeric flex items-center gap-3 text-title font-medium"
            >
              <Phone className="h-5 w-5 text-ochre-400" />
              {CONTACTS.phone}
            </a>
            <a
              href={`mailto:${CONTACTS.email}`}
              className="flex items-center gap-3 break-all text-graphite-300 transition-colors hover:text-ivory-50"
            >
              <Mail className="h-4 w-4 shrink-0 text-ochre-400" />
              {CONTACTS.email}
            </a>
          </div>

          <div data-menu-fade className="flex flex-col gap-3 sm:flex-row">
            <Action
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                onClose()
                openLeadForm({ source: "header-contact" })
              }}
            >
              Связаться с нами
              <ArrowUpRight className={actionArrowClass} />
            </Action>
            <ActionAnchor
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "mobile-menu" })}
              variant="glass"
              size="lg"
              className="w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              Написать в WhatsApp
            </ActionAnchor>
          </div>
        </div>
      </div>
    </div>
  )
}
