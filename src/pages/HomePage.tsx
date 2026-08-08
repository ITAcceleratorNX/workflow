import { Seo } from "../components/layout/Layout"
import { HeroSection } from "../components/home/HeroSection"
import { OfficeFormatsSection } from "../components/home/OfficeFormatsSection"
import { ServicedOfficeSection } from "../components/home/ServicedOfficeSection"
import { OtherPropertiesSection } from "../components/home/OtherPropertiesSection"
import { PropertyShowcase } from "../components/property/PropertyShowcase"
import { KOKTEM_TOWERS, TIME_SQUARE, VENUS } from "../lib/properties"

export function HomePage() {
  return (
    <>
      <Seo
        title={TIME_SQUARE.metaTitle}
        description={TIME_SQUARE.metaDescription}
        path="/"
      />
      <HeroSection />
      <OfficeFormatsSection />
      <ServicedOfficeSection />
      <PropertyShowcase
        property={TIME_SQUARE}
        headingLevel="h2"
        eyebrow="Объект · Бизнес-центр класса А"
      />
      <OtherPropertiesSection properties={[VENUS, KOKTEM_TOWERS]} />
    </>
  )
}
