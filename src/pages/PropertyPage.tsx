import { Seo } from "../components/layout/Layout"
import { PropertyShowcase } from "../components/property/PropertyShowcase"
import { OtherPropertiesSection } from "../components/home/OtherPropertiesSection"
import type { PropertySlug } from "../lib/properties"
import { useLocale } from "../lib/i18n/LocaleProvider"
import { getLocalizedProperties, getLocalizedProperty } from "../lib/i18n/content"

export function PropertyPage({ slug }: { slug: PropertySlug }) {
  const { locale } = useLocale()
  const property = getLocalizedProperty(slug, locale)
  const others = getLocalizedProperties(locale).filter((item) => item.slug !== slug)

  return (
    <>
      <Seo
        title={property.metaTitle}
        description={property.metaDescription}
        path={property.path}
        image={property.cover}
      />
      <PropertyShowcase
        property={property}
        headingLevel="h1"
        eyebrow={property.shortLabel}
        priority
      />
      <OtherPropertiesSection properties={others} />
    </>
  )
}
