import { useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Maximize } from "lucide-react"
import { Action } from "../ui/Action"
import { SectionTitle } from "../ui/SectionTitle"
import { SmartImage } from "../ui/SmartImage"
import { Lightbox } from "../ui/Lightbox"
import { Appear } from "../motion/Appear"
import { cn } from "../../lib/utils"
import { useScrollToElement } from "../../lib/smoothScroll"
import {
  PHOTO_CATEGORY_LABELS,
  type PhotoCategory,
  type Property,
} from "../../lib/properties"

/** Сколько кадров показываем до нажатия «Показать все»: ровно заполняет сетку с большим первым фото */
const PREVIEW_COUNT = 6

const CATEGORY_ORDER: PhotoCategory[] = [
  "facade",
  "entrance",
  "hall",
  "offices",
  "elevators",
  "common",
  "parking",
  "renders",
  "infrastructure",
]

/** Фотогалерея с фильтром по назначению и просмотром увеличенного изображения (5.10 / 6.6 / 7.6). */
export function PropertyGallery({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | "all">("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const gridRef = useRef<HTMLUListElement>(null)

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((category) => property.photos.some((p) => p.category === category)),
    [property.photos]
  )

  const photos = useMemo(
    () =>
      activeCategory === "all"
        ? property.photos
        : property.photos.filter((photo) => photo.category === activeCategory),
    [property.photos, activeCategory]
  )

  /* Показываем первые кадры, остальные - по кнопке: галереи объектов бывают большими */
  const visiblePhotos = expanded ? photos : photos.slice(0, PREVIEW_COUNT)

  const selectCategory = (category: PhotoCategory | "all") => {
    setActiveCategory(category)
    setExpanded(false)
  }

  const scrollToElement = useScrollToElement()

  const collapse = () => {
    setExpanded(false)
    scrollToElement(gridRef.current)
  }

  return (
    <section className="bg-graphite-950 py-24 text-ivory-50 sm:py-32">
      <div className="shell">
        <SectionTitle
          as={level}
          tone="dark"
          label="Фотографии"
          title={
            <>
              Как выглядит <span className="accent-serif text-ochre-300">{property.name}</span>
            </>
          }
          description="Нажмите на фотографию, чтобы открыть её в увеличенном виде."
        />

        <Appear delay={0.1} className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-2">
          <FilterChip label="Все" active={activeCategory === "all"} onClick={() => selectCategory("all")} />
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={PHOTO_CATEGORY_LABELS[category]}
              active={activeCategory === category}
              onClick={() => selectCategory(category)}
            />
          ))}
        </Appear>

        {/* Первое фото крупное: на широком экране 6 кадров ровно заполняют сетку 3×3 */}
        <Appear delay={0.15}>
          <ul
            ref={gridRef}
            className="mt-6 grid scroll-mt-28 auto-rows-[260px] grid-cols-1 gap-3 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-3"
          >
            {visiblePhotos.map((photo, index) => (
              <li key={photo.src} className={cn(index === 0 && "sm:col-span-2 sm:row-span-2")}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Открыть фото: ${photo.alt}`}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-graphite-900"
                >
                  <SmartImage
                    src={photo.src}
                    alt={photo.alt}
                    placeholderLabel={PHOTO_CATEGORY_LABELS[photo.category]}
                    sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    className="transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-graphite-950/80 to-transparent p-4 text-left">
                    <span className="text-sm text-ivory-50">{PHOTO_CATEGORY_LABELS[photo.category]}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-ivory-50 opacity-0 backdrop-blur-md transition-opacity duration-400 group-hover:opacity-100">
                      <Maximize className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Appear>

        {photos.length > PREVIEW_COUNT && (
          <div className="mt-10 flex justify-center">
            {expanded ? (
              <Action variant="glass" size="lg" onClick={collapse}>
                Свернуть
                <ChevronUp className="h-4 w-4" />
              </Action>
            ) : (
              <Action variant="glass" size="lg" onClick={() => setExpanded(true)}>
                Показать все фото
                <span className="numeric text-graphite-400">{photos.length}</span>
                <ChevronDown className="h-4 w-4" />
              </Action>
            )}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-11 shrink-0 rounded-full border px-5 text-sm transition-colors duration-400",
        active
          ? "border-ochre-500 bg-ochre-500 text-graphite-950"
          : "border-white/15 text-graphite-200 hover:border-white/40 hover:text-ivory-50"
      )}
    >
      {label}
    </button>
  )
}
