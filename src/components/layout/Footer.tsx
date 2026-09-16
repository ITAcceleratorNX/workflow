import { Link } from "react-router-dom"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { Action, ActionAnchor } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { TextReveal } from "../motion/TextReveal"
import { Appear } from "../motion/Appear"
import { Logo } from "./Logo"
import { CONTACTS, WHATSAPP_DEFAULT_MESSAGE, track, whatsappLink } from "../../lib/site"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"
import { useLenis } from "../../lib/smoothScroll"

export function Footer() {
  const { openLeadForm } = useLeadForm()
  const lenis = useLenis()

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden bg-graphite-950 text-ivory-50">
      <div className="shell pt-20 sm:pt-28">
        {/* Призыв и прямые контакты */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Appear className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
              <p className="label text-ochre-400">Связаться с нами</p>
            </Appear>
            <TextReveal as="h2" className="mt-8 text-display-lg font-medium text-ivory-50">
              Подберём офис <span className="accent-serif text-ochre-400">под задачи</span> вашей
              компании
            </TextReveal>
            <Appear delay={0.2} as="p" className="mt-6 max-w-xl text-lead text-graphite-300">
              Офисные и коммерческие помещения в Алматы. Сопроводим от заявки до заезда.
            </Appear>
            <Appear delay={0.3} stagger={0.08} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Action size="lg" onClick={() => openLeadForm({ source: "footer-contact" })}>
                Связаться с нами
                <ArrowUpRight className={actionArrowClass} />
              </Action>
              <ActionAnchor
                href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { placement: "footer" })}
                variant="glass"
                size="lg"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                Написать в WhatsApp
              </ActionAnchor>
            </Appear>
          </div>

          <Appear delay={0.2} className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="label text-graphite-400">Телефон</p>
              <a
                href={CONTACTS.phoneHref}
                onClick={() => track("phone_click", { placement: "footer" })}
                className="numeric mt-3 block text-title font-medium transition-colors hover:text-ochre-300"
              >
                {CONTACTS.phone}
              </a>
            </div>
            <div>
              <p className="label text-graphite-400">Почта</p>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="mt-3 block break-all text-lead text-graphite-200 transition-colors hover:text-ochre-300"
              >
                {CONTACTS.email}
              </a>
            </div>
          </Appear>
        </div>

        {/* Объекты */}
        <nav aria-label="Объекты в подвале" className="mt-20 border-t border-white/10 pt-10 sm:mt-28">
          <h2 className="label text-graphite-400">Бизнес-центры</h2>
          <Appear as="ul" stagger={0.08} className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {PROPERTIES.map((property) => (
              <li key={property.slug}>
                <Link to={property.path} className="group block">
                  <span className="flex items-center gap-2 text-title font-medium transition-colors duration-400 group-hover:text-ochre-300">
                    {property.name}
                    <ArrowUpRight className="h-5 w-5 text-graphite-500 transition-[transform,color] duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ochre-300" />
                  </span>
                  <span className="mt-2 block text-sm text-graphite-400">{property.shortLabel}</span>
                  <span className="mt-1 block text-sm text-graphite-400">{property.address}</span>
                </Link>
              </li>
            ))}
          </Appear>
        </nav>

        {/* Нижняя строка */}
        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 py-8 text-sm text-graphite-400 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="order-first sm:order-none" />
          <p>© {new Date().getFullYear()} TMK WorkFlow. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-ivory-50">
              Политика конфиденциальности
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 transition-colors hover:text-ivory-50"
            >
              Наверх
              <ArrowUp className="h-4 w-4 transition-transform duration-400 ease-out-expo group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Крупное название — подпись сайта; декоративное, читалкам экрана не нужно */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <TextReveal
          as="p"
          by="chars"
          stagger={0.04}
          className="-mb-[0.18em] whitespace-nowrap text-center text-[19.5vw] font-medium leading-none tracking-[-0.06em] text-graphite-600"
        >
          WorkFlow
        </TextReveal>
      </div>
    </footer>
  )
}
