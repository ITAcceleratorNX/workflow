import { useMemo, useState } from "react"
import { Maximize } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { Lightbox } from "../ui/Lightbox"
import { cn } from "../../lib/utils"
import {
  PHOTO_CATEGORY_LABELS,
  type PhotoCategory,
  type Property,
} from "../../lib/properties"

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

  return (
    <Section tone="brand" size="md">
      <SectionHeading
        eyebrow="Фотографии"
        title={`Как выглядит ${property.name}`}
        description="Нажмите на фотографию, чтобы открыть её в увеличенном виде."
        level={level}
      />

      <Reveal className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar" delay={60}>
        <FilterChip
          label="Все"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {categories.map((category) => (
          <FilterChip
            key={category}
            label={PHOTO_CATEGORY_LABELS[category]}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </Reveal>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <Reveal as="li" key={photo.src} delay={(index % 3) * 60}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="zoom-media group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-100 shadow-card transition hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <SmartImage
                src={photo.src}
                alt={photo.alt}
                placeholderLabel={PHOTO_CATEGORY_LABELS[photo.category]}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-brand-900/85 to-transparent p-4 text-left">
                <span className="text-sm font-medium text-white">
                  {PHOTO_CATEGORY_LABELS[photo.category]}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white opacity-0 transition group-hover:opacity-100">
                  <Maximize className="h-4 w-4" />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

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
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-orange-500 bg-orange-500 text-white"
          : "border-brand-200 bg-white text-brand-800 hover:border-brand-400"
      )}
    >
      {label}
    </button>
  )
}
