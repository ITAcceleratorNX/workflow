import { PropertyHero } from "./PropertyHero"
import { PropertyInfo } from "./PropertyInfo"
import { EcosystemBlock } from "./EcosystemBlock"
import { AvailabilityAndSpecs } from "./AvailabilityAndSpecs"
import { AdvantagesGrid } from "./AdvantagesGrid"
import { PropertyGallery } from "./PropertyGallery"
import { ViewingSection } from "./ViewingSection"
import type { Property } from "../../lib/properties"

interface PropertyShowcaseProps {
  property: Property
  /** На странице объекта заголовок — H1, на главной блок Time Square идёт как H2 */
  headingLevel: "h1" | "h2"
  eyebrow: string
  priority?: boolean
}

/**
 * Полный блок объекта в порядке ТЗ:
 * фото → информация → экосистема TMK → свободные площади и характеристики →
 * преимущества → фотографии → запись на просмотр.
 */
export function PropertyShowcase({
  property,
  headingLevel,
  eyebrow,
  priority = false,
}: PropertyShowcaseProps) {
  /* Заголовки вложенных секций всегда на уровень ниже заголовка объекта */
  const level = headingLevel === "h1" ? "h2" : "h3"

  return (
    <>
      <PropertyHero
        property={property}
        headingLevel={headingLevel}
        title={headingLevel === "h1" ? property.h1 : property.name}
        eyebrow={eyebrow}
        priority={priority}
      />
      <PropertyInfo property={property} level={level} />
      <EcosystemBlock level={level} />
      <AvailabilityAndSpecs property={property} level={level} />
      <AdvantagesGrid property={property} level={level} />
      <PropertyGallery property={property} level={level} />
      <ViewingSection property={property} level={level} />
    </>
  )
}
