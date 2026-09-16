import { ArrowUpRight } from "lucide-react"
import { Action, ActionAnchor } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import { LeadForm } from "../lead/LeadForm"
import { CONTACTS, track, whatsappLink } from "../../lib/site"
import { useLeadForm } from "../../lib/leadFormContext"
import type { Property } from "../../lib/properties"

/**
 * Запись на просмотр и контакты.
 * На странице объекта — с названием БЦ и предзаполненным полем;
 * на главной — без названия конкретного объекта.
 */
export function ViewingSection({
  property,
  level = "h2",
}: {
  property?: Property
  level?: "h2" | "h3"
}) {
  const { openLeadForm } = useLeadForm()
  const sectionId = property ? `viewing-${property.slug}` : "viewing"
  const whatsappText = property
    ? `Здравствуйте! Хочу записаться на просмотр помещений в ${property.name}.`
    : "Здравствуйте! Хочу записаться на просмотр офисов TMK WorkFlow."
  const placement = { placement: "viewing", property: property?.name ?? "home" }

  return (
    <section id={sectionId} className="bg-pine-900 py-24 text-ivory-50 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Appear className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-400">Запись на просмотр</p>
          </Appear>
          <TextReveal as={level} className="mt-6 text-display-lg font-medium text-ivory-50">
            {property ? `Посмотрите ${property.name} ` : "Посмотрите "}
            <span className="accent-serif text-ochre-300">вживую</span>
          </TextReveal>
          <Appear as="p" delay={0.15} className="mt-6 max-w-lg text-lead text-graphite-200">
            Оставьте заявку — согласуем удобное время, покажем свободные помещения и ответим на
            вопросы по условиям аренды.
          </Appear>

          <Appear delay={0.25} className="mt-12 space-y-6 border-t border-white/10 pt-8">
            <div>
              <p className="label text-graphite-400">Телефон</p>
              <a
                href={CONTACTS.phoneHref}
                onClick={() => track("phone_click", placement)}
                className="numeric mt-3 block text-title font-medium transition-colors hover:text-ochre-300"
              >
                {CONTACTS.phone}
              </a>
            </div>
            <div>
              <p className="label text-graphite-400">Почта</p>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="mt-3 block break-all text-graphite-200 transition-colors hover:text-ochre-300"
              >
                {CONTACTS.email}
              </a>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <ActionAnchor
                href={whatsappLink(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", placement)}
                variant="glass"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                Написать в WhatsApp
              </ActionAnchor>
              <Action
                variant="glass"
                onClick={() =>
                  openLeadForm({
                    source: property ? "property-contact" : "home-select-office",
                    property: property?.name,
                  })
                }
              >
                Связаться с нами
                <ArrowUpRight className={actionArrowClass} />
              </Action>
            </div>
          </Appear>
        </div>

        <Appear delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-3xl bg-ivory-50 p-6 text-graphite-950 sm:p-10">
            <LeadForm key={property?.slug ?? "home"} source="viewing" defaultProperty={property?.name} />
          </div>
        </Appear>
      </div>
    </section>
  )
}
