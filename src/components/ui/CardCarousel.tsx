import { useRef, useState } from "react"
import { SmartImage } from "./SmartImage"
import { cn } from "../../lib/utils"

interface CardCarouselProps {
  images: readonly string[]
  alt: string
  placeholderLabel?: string
  sizes?: string
  className?: string
}

/** Сдвиг, после которого жест считается перелистыванием, px */
const SWIPE_THRESHOLD = 40

/** Карусель фотографий внутри карточки: точки-переключатели и свайп (пальцем или мышью). */
export function CardCarousel({ images, alt, placeholderLabel, sizes, className }: CardCarouselProps) {
  const [index, setIndex] = useState(0)
  /* Остальные кадры грузим заранее, как только посетитель потянулся к карточке */
  const [warm, setWarm] = useState(false)
  const startX = useRef<number | null>(null)
  const count = images.length

  const finishSwipe = (endX: number) => {
    if (startX.current === null) return
    const delta = endX - startX.current
    startX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    setIndex((current) => Math.min(count - 1, Math.max(0, current + (delta < 0 ? 1 : -1))))
  }

  return (
    <div
      /* Размер задаёт только контейнер (aspect-* снаружи): лента лежит абсолютно и на высоту не влияет */
      className={cn(
        "relative touch-pan-y select-none overflow-hidden",
        count > 1 && "cursor-grab active:cursor-grabbing",
        className
      )}
      onMouseEnter={() => setWarm(true)}
      onFocus={() => setWarm(true)}
      onPointerDown={(event) => {
        setWarm(true)
        startX.current = event.clientX
      }}
      onPointerUp={(event) => finishSwipe(event.clientX)}
      onPointerCancel={() => (startX.current = null)}
      onPointerLeave={(event) => finishSwipe(event.clientX)}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="h-full w-full shrink-0" aria-hidden={i !== index}>
            <SmartImage
              src={src}
              alt={`${alt} — ${i + 1}/${count}`}
              placeholderLabel={placeholderLabel}
              priority={warm && i !== 0}
              sizes={sizes}
              className="pointer-events-none h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/35 to-transparent pb-2 pt-6">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Фото ${i + 1} из ${count}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              onPointerDown={(event) => event.stopPropagation()}
              /* Точка маленькая, а область нажатия — крупная */
              className="group/dot flex h-7 items-center px-1 focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-orange-500",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/70 group-hover/dot:bg-white"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
