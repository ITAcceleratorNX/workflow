import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { Lightbox } from "../ui/Lightbox"
import { cn } from "../../lib/utils"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import { getPhotoCategoryLabel } from "../../lib/i18n/content"
import type { PhotoCategory, Property } from "../../lib/properties"

/** Сколько разделов показываем плитками; остальные фото доступны в Lightbox */
const MAX_TILES = 3

/**
 * Компактная фотогалерея сразу под первым экраном — «фото по разделам».
 * Три плитки: первый раздел (фасад) и два самых наполненных. На плитке — обложка,
 * название и число кадров. Плитка открывает Lightbox с первого фото раздела,
 * дальше можно листать все фотографии объекта подряд.
 */
export function PropertyGallery({
  property,
  level: Heading,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const { locale, t } = useLocale()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const photos = property.photos

  /* Разделы в том порядке, в каком они идут в списке фото объекта */
  const groups = useMemo(() => {
    const result: Array<{ category: PhotoCategory; firstIndex: number; count: number }> = []
    photos.forEach((photo, index) => {
      const group = result.find((item) => item.category === photo.category)
      if (group) group.count += 1
      else result.push({ category: photo.category, firstIndex: index, count: 1 })
    })
    if (result.length <= MAX_TILES) return result
    /* Первый раздел оставляем всегда, остальные места — разделам с наибольшим числом фото */
    const [first, ...rest] = result
    const largest = [...rest].sort((a, b) => b.count - a.count).slice(0, MAX_TILES - 1)
    return [first, ...rest.filter((group) => largest.includes(group))]
  }, [photos])

  if (groups.length === 0) return null

  return (
    <Section tone="white" size="sm" className="pb-0 sm:pb-0">
      <Reveal className="flex items-baseline justify-between gap-4">
        <Heading className="eyebrow">{t.property.galleryEyebrow}</Heading>
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
        >
          {t.property.showAllPhotos} ({photos.length})
        </button>
      </Reveal>

      <Reveal delay={60}>
        {/* На узких экранах ряд прокручивается пальцем, на широких плитки делят ширину */}
        <ul className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          {groups.map((group, position) => {
            const cover = photos[group.firstIndex]
            const label = getPhotoCategoryLabel(group.category, locale)
            return (
              <li
                /* Ключ по файлу, а не по разделу: иначе при переходе между объектами
                   плитка одноимённого раздела оставляет картинку прошлого объекта */
                key={cover.src}
                className={cn(
                  "w-[62vw] shrink-0 snap-start sm:w-auto sm:shrink sm:basis-0",
                  /* Первый раздел — обычно фасад — крупнее остальных */
                  position === 0 ? "sm:grow-[2]" : "sm:grow"
                )}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(group.firstIndex)}
                  aria-label={`${label}: ${group.count}`}
                  className="zoom-media group relative block h-44 w-full overflow-hidden rounded-2xl bg-brand-100 shadow-card transition hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:h-56 lg:h-72"
                >
                  <SmartImage
                    src={cover.src}
                    alt={cover.alt}
                    placeholderLabel={label}
                    sizes="(max-width: 640px) 62vw, 50vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-brand-900/95 via-brand-900/70 to-transparent p-4 pt-20 text-left">
                    <span>
                      <span className="block text-base font-semibold leading-tight text-white sm:text-lg">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm text-white/85">
                        {group.count} {t.property.photosCount}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition group-hover:bg-orange-500">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Reveal>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </Section>
  )
}
