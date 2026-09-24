import { Mail, Phone } from "lucide-react"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { Button } from "../ui/button"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { LeadForm } from "../lead/LeadForm"
import { CONTACTS, track } from "../../lib/site"
import { useLeadForm } from "../../lib/leadFormContext"
import { useWhatsAppGate } from "../../lib/whatsappGateContext"
import type { Property } from "../../lib/properties"

/**
 * Запись на просмотр и контакты.
 * На странице объекта — с названием БЦ и предзаполненным полем;
 * на главной — без названия конкретного объекта.
 */
export function ViewingSection({
  property,
  level: Heading = "h2",
}: {
  property?: Property
  level?: "h2" | "h3"
}) {
  const { openLeadForm } = useLeadForm()
  const { openWhatsAppGate } = useWhatsAppGate()
  const sectionId = property ? `viewing-${property.slug}` : "viewing"
  const title = property ? `Посмотрите ${property.name} вживую` : "Посмотрите вживую"

  return (
    <Section id={sectionId} tone="deep" size="lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-brand-300">Запись на просмотр</p>
          <Heading className="mt-3 text-3xl text-white sm:text-4xl">{title}</Heading>
          <p className="mt-4 text-base leading-relaxed text-brand-100">
            Оставьте заявку — согласуем удобное время, покажем свободные помещения и ответим на
            вопросы по условиям аренды.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={CONTACTS.phoneHref}
              onClick={() =>
                track("phone_click", {
                  placement: "viewing",
                  property: property?.name ?? "home",
                })
              }
              className="flex items-center gap-3 text-lg font-semibold text-white transition hover:text-orange-400"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Phone className="h-5 w-5 text-orange-400" />
              </span>
              {CONTACTS.phone}
            </a>
            <a
              href={`mailto:${CONTACTS.email}`}
              className="flex items-center gap-3 break-all text-[15px] text-brand-100 transition hover:text-orange-400"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Mail className="h-5 w-5 text-orange-400" />
              </span>
              {CONTACTS.email}
            </a>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  openLeadForm({
                    source: property ? "property-contact" : "home-select-office",
                    property: property?.name,
                  })
                }
              >
                Связаться с нами
              </Button>
              <Button
                onClick={() =>
                  openWhatsAppGate({
                    placement: "viewing",
                    property: property?.name,
                  })
                }
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                Написать в WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-2xl bg-white p-6 shadow-float sm:p-8">
            <LeadForm
              key={property?.slug ?? "home"}
              source="viewing"
              defaultProperty={property?.name}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
