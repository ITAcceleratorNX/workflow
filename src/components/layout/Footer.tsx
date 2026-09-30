import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { CONTACTS, track } from "../../lib/site"
import { useLeadForm } from "../../lib/leadFormContext"
import { useWhatsAppGate } from "../../lib/whatsappGateContext"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import { getLocalizedProperties } from "../../lib/i18n/content"

export function Footer() {
  const { openLeadForm } = useLeadForm()
  const { openWhatsAppGate } = useWhatsAppGate()
  const { locale, t } = useLocale()
  const properties = getLocalizedProperties(locale)

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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200">{t.footer.about}</p>
            <Button
              onClick={() => openLeadForm({ source: "footer-contact" })}
              className="mt-6"
            >
              {t.nav.contactUs}
            </Button>
          </div>

          <nav aria-label={t.footer.objects}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
              {t.footer.objects}
            </h2>
            <ul className="mt-4 space-y-3">
              {properties.map((property) => (
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
              {t.footer.contacts}
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
            <Button
              onClick={() => openWhatsAppGate({ placement: "footer" })}
              variant="outline"
              className="mt-5 border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              {t.form.writeWhatsApp}
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TMK WorkFlow. {t.footer.rights}
          </p>
          <Link to="/privacy" className="transition hover:text-orange-400">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  )
}
