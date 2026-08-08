import { Seo } from "../components/layout/Layout"
import { PropertyShowcase } from "../components/property/PropertyShowcase"
import { OtherPropertiesSection } from "../components/home/OtherPropertiesSection"
import { PROPERTIES, getProperty, type PropertySlug } from "../lib/properties"

export function PropertyPage({ slug }: { slug: PropertySlug }) {
  const property = getProperty(slug)
  const others = PROPERTIES.filter((item) => item.slug !== slug)

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
