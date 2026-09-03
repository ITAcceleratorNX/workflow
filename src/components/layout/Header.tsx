import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, Phone, X } from "lucide-react"
import { Button, LinkButton } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { cn } from "../../lib/utils"
import { CONTACTS, WHATSAPP_DEFAULT_MESSAGE, track, whatsappLink } from "../../lib/site"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { openLeadForm } = useLeadForm()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative py-2 text-[15px] font-medium transition-colors",
      isActive ? "text-orange-600" : "text-brand-800 hover:text-brand-600",
      isActive &&
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-orange-500"
    )

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="container-site">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="TMK WorkFlow — главная"
          >
            <img
              src="/logo-40.webp"
              srcSet="/logo-40.webp 1x, /logo-80.webp 2x, /logo-120.webp 3x"
              alt=""
              className="h-10 w-10 rounded-lg object-contain"
              width={40}
              height={40}
            />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight text-brand-900">
                TMK <span className="text-orange-500">WorkFlow</span>
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-wider text-ink-soft sm:block">
                Коммерческая недвижимость
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Объекты">
            {PROPERTIES.map((property) => (
              <NavLink key={property.slug} to={property.path} end className={navLinkClass}>
                {property.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "header" })}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[15px] font-semibold text-brand-900 transition hover:text-orange-600 xl:flex"
            >
              <Phone className="h-4 w-4 text-orange-500" />
              {CONTACTS.phone}
            </a>

            <a
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "header-mobile" })}
              aria-label={`Позвонить ${CONTACTS.phone}`}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-200 text-brand-800 transition hover:border-brand-400 hover:bg-brand-50 xl:hidden"
            >
              <Phone className="h-5 w-5" />
            </a>

            <LinkButton
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "header" })}
              variant="outline"
              size="icon"
              aria-label="Написать в WhatsApp"
              className="sm:w-auto sm:px-4"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </LinkButton>

            <Button
              onClick={() => openLeadForm({ source: "header-contact" })}
              className="hidden lg:inline-flex"
            >
              Связаться с нами
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-200 text-brand-800 transition hover:bg-brand-50 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-100 bg-white lg:hidden">
          <div className="container-site flex flex-col gap-1 py-4">
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Объекты
            </p>
            {PROPERTIES.map((property) => (
              <NavLink
                key={property.slug}
                to={property.path}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium transition",
                    isActive ? "bg-orange-50 text-orange-600" : "text-brand-900 hover:bg-brand-50"
                  )
                }
              >
                {property.name}
                <span className="text-xs font-normal text-ink-soft">{property.shortLabel}</span>
              </NavLink>
            ))}

            <Button
              onClick={() => {
                setMenuOpen(false)
                openLeadForm({ source: "header-contact" })
              }}
              size="lg"
              className="mt-3 w-full"
            >
              Связаться с нами
            </Button>

            <a
              href={CONTACTS.phoneHref}
              onClick={() => track("phone_click", { placement: "mobile-menu" })}
              className="mt-2 flex items-center justify-center gap-2 py-2 text-base font-semibold text-brand-900"
            >
              <Phone className="h-4 w-4 text-orange-500" />
              {CONTACTS.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
