import { useEffect, useRef, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Phone } from "lucide-react"
import { Action, ActionAnchor } from "../ui/Action"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { Logo } from "./Logo"
import { SiteMenu } from "./SiteMenu"
import { cn } from "../../lib/utils"
import { CONTACTS, WHATSAPP_DEFAULT_MESSAGE, track, whatsappLink } from "../../lib/site"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"
import { useScrollLock } from "../../lib/smoothScroll"
import { HEADER_HERO_ATTRIBUTE, hasDarkHero } from "../../lib/navigation"
import { useIntroPhase } from "../../lib/intro"

/* Высота шапки (h-16 / lg:h-20) — граница, после которой hero считается пройденным */
const HEADER_HEIGHT = 80
/* Ниже этой отметки шапка прячется при прокрутке вниз; выше — всегда на месте */
const HIDE_AFTER = 480
/* Мелкие подёргивания колеса и тачпада не переключают видимость */
const DIRECTION_THRESHOLD = 6
const DESKTOP_QUERY = "(min-width: 1024px)"

interface ScrollState {
  /** Hero ушёл из-под шапки — нужна плотная подложка */
  pastHero: boolean
  /** Прокрутка вниз — шапка уезжает, вверх — возвращается */
  hidden: boolean
}

function readPastHero() {
  const hero = document.querySelector(`[${HEADER_HERO_ATTRIBUTE}]`)
  return hero ? hero.getBoundingClientRect().bottom <= HEADER_HEIGHT : window.scrollY > 24
}

function useHeaderScroll(): ScrollState {
  const [state, setState] = useState<ScrollState>(() => ({ pastHero: readPastHero(), hidden: false }))

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      if (Math.abs(delta) < DIRECTION_THRESHOLD && y > 0) return
      lastY = y

      const pastHero = readPastHero()
      const hidden = y > HIDE_AFTER && delta > 0

      setState((prev) =>
        prev.pastHero === pastHero && prev.hidden === hidden ? prev : { pastHero, hidden }
      )
    }

    /* Lenis прокручивает окно, поэтому родного события scroll достаточно; считаем раз в кадр */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return state
}

export function Header() {
  const { pathname } = useLocation()
  const { openLeadForm } = useLeadForm()
  const { pastHero, hidden: hiddenOnScroll } = useHeaderScroll()
  const introPhase = useIntroPhase()
  /* Во время заставки шапка ждёт наверху за краем экрана и въезжает вместе со шторкой */
  const hidden = hiddenOnScroll || introPhase === "loading"
  const toggleRef = useRef<HTMLButtonElement>(null)

  /* Меню открыто «на странице»: после перехода по адресу оно закрывается само */
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null)
  const menuOpen = menuOpenOn === pathname
  const closeMenu = () => setMenuOpenOn(null)

  useScrollLock(menuOpen)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpenOn(null)
    }
    /* На широком экране меню не нужно — навигация уже в шапке */
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onDesktop = () => {
      if (desktop.matches) setMenuOpenOn(null)
    }

    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onDesktop)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onDesktop)
    }
  }, [menuOpen])

  const solid = !menuOpen && (pastHero || !hasDarkHero(pathname))

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b text-ivory-50 transition-[transform,background-color,border-color] duration-600 ease-out-expo",
          /* Фокус с клавиатуры возвращает спрятанную шапку (фокус после касания — нет) */
          "has-[:focus-visible]:translate-y-0",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          solid
            ? "border-white/10 bg-graphite-950/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        {/* Мягкое затемнение сверху: навигация читается над любым кадром видео или светлым небом */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[160%] bg-gradient-to-b from-graphite-950/55 to-transparent transition-opacity duration-600",
            solid || menuOpen ? "opacity-0" : "opacity-100"
          )}
        />

        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo onClick={closeMenu} />

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Объекты">
            {PROPERTIES.map((property) => (
              <NavLink
                key={property.slug}
                to={property.path}
                end
                className={({ isActive }) =>
                  cn(
                    "relative py-2 text-[15px] transition-colors duration-400",
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-ochre-500 after:transition-transform after:duration-600 after:ease-out-expo",
                    isActive
                      ? "text-ivory-50 after:scale-x-100"
                      : "text-ivory-50/70 after:scale-x-0 hover:text-ivory-50 hover:after:scale-x-100"
                  )
                }
              >
                {property.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "header" })}
              className="numeric mr-3 hidden items-center gap-2 text-[15px] transition-colors hover:text-ochre-300 xl:flex"
            >
              <Phone className="h-4 w-4 text-ochre-400" />
              {CONTACTS.phone}
            </a>

            <ActionAnchor
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "header-mobile" })}
              aria-label={`Позвонить ${CONTACTS.phone}`}
              variant="glass"
              size="icon"
              className="h-11 w-11 xl:hidden"
            >
              <Phone className="h-[18px] w-[18px]" />
            </ActionAnchor>

            <ActionAnchor
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "header" })}
              aria-label="Написать в WhatsApp"
              variant="glass"
              size="icon"
              className="h-11 w-11"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            </ActionAnchor>

            <Action
              size="sm"
              className="ml-1 hidden h-11 lg:inline-flex"
              onClick={() => openLeadForm({ source: "header-contact" })}
            >
              Связаться с нами
            </Action>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-md transition-colors duration-400 hover:border-white/50 hover:bg-white/[0.14] lg:hidden"
            >
              {/* Две линии складываются в крестик */}
              <span aria-hidden="true" className="relative block h-3 w-[18px]">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-current transition-transform duration-600 ease-out-expo",
                    menuOpen && "translate-y-[5.25px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-current transition-transform duration-600 ease-out-expo",
                    menuOpen && "-translate-y-[5.25px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Меню — соседом шапки, а не внутри: transform шапки сломал бы fixed-позиционирование */}
      <SiteMenu open={menuOpen} onClose={closeMenu} toggleRef={toggleRef} />
    </>
  )
}
