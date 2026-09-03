import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button, LinkButton } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { CONTACTS, WHATSAPP_DEFAULT_MESSAGE, track, whatsappLink } from "../../lib/site"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"

export function Footer() {
  const { openLeadForm } = useLeadForm()

  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-site py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo-white-40.webp"
                srcSet="/logo-white-40.webp 1x, /logo-white-80.webp 2x, /logo-white-120.webp 3x"
                alt=""
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
                loading="lazy"
              />
              <span className="text-lg font-extrabold tracking-tight">
                TMK <span className="text-orange-400">WorkFlow</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200">
              Офисные и коммерческие помещения в Алматы. Подберём формат под задачи вашей компании
              и сопроводим от заявки до заезда.
            </p>
            <Button
              onClick={() => openLeadForm({ source: "footer-contact" })}
              className="mt-6"
            >
              Связаться с нами
            </Button>
          </div>

          <nav aria-label="Объекты в подвале">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              Объекты
            </h2>
            <ul className="mt-4 space-y-3">
              {PROPERTIES.map((property) => (
                <li key={property.slug}>
                  <Link
                    to={property.path}
                    className="group flex flex-col text-[15px] text-white transition hover:text-orange-400"
                  >
                    <span className="font-medium">{property.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-brand-300">
                      <MapPin className="h-3 w-3" />
                      {property.address}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              Контакты
            </h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <a
                  href={CONTACTS.phoneHref}
                  onClick={() => track("phone_click", { placement: "footer" })}
                  className="flex items-center gap-2 font-semibold transition hover:text-orange-400"
                >
                  <Phone className="h-4 w-4 text-orange-400" />
                  {CONTACTS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="flex items-center gap-2 break-all text-brand-100 transition hover:text-orange-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                  {CONTACTS.email}
                </a>
              </li>
            </ul>
            <LinkButton
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "footer" })}
              variant="outline"
              className="mt-5 border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              Написать в WhatsApp
            </LinkButton>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TMK WorkFlow. Все права защищены.</p>
          <Link to="/privacy" className="transition hover:text-orange-400">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
