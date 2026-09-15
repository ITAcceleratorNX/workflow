import { Seo } from "../components/layout/Layout"
import { HeroSection } from "../components/home/HeroSection"
import { OfficeFormatsSection } from "../components/home/OfficeFormatsSection"
import { PropertyCardsSection } from "../components/home/PropertyCardsSection"
import { MapLeadSection } from "../components/home/MapLeadSection"
import { ViewingSection } from "../components/property/ViewingSection"

const HOME_SEO = {
  title: "TMK WorkFlow — офисы и коммерческие помещения в аренду в Алматы",
  description:
    "Аренда офисов в Алматы: бизнес-центры Time Square, Venus и Koktem Towers класса А. Подберём объект и формат офиса под задачи компании.",
} as const

export function HomePage() {
  return (
    <>
      <Seo title={HOME_SEO.title} description={HOME_SEO.description} path="/" />
      <HeroSection />
      <OfficeFormatsSection />
      <PropertyCardsSection />
      <MapLeadSection />
      <ViewingSection />
    </>
  )
}
