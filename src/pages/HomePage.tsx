import { Seo } from "../components/layout/Layout"
import { HeroSection } from "../components/home/HeroSection"
import { OfficeFormatsSection } from "../components/home/OfficeFormatsSection"
import { PropertyCardsSection } from "../components/home/PropertyCardsSection"
import { MapLeadSection } from "../components/home/MapLeadSection"
import { ViewingSection } from "../components/property/ViewingSection"
import { useLocale } from "../lib/i18n/LocaleProvider"

export function HomePage() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={t.home.seoTitle} description={t.home.seoDescription} path="/" />
      <HeroSection />
      <PropertyCardsSection />
      <OfficeFormatsSection />
      <MapLeadSection />
      <ViewingSection />
    </>
  )
}
