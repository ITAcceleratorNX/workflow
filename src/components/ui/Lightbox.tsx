import { useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { PropertyPhoto } from "../../lib/properties"

interface LightboxProps {
  photos: PropertyPhoto[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Просмотр увеличенного изображения галереи (раздел 8 ТЗ). */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index]

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  )
  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") goPrev()
      if (event.key === "ArrowRight") goNext()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, goPrev, goNext])

  if (!photo) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/95 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть просмотр"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущее фото"
            onClick={(event) => {
              event.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            onClick={(event) => {
              event.stopPropagation()
              goNext()
            }}
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <figure
        className="flex max-h-full w-full max-w-5xl flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
        />
        <figcaption className="text-center text-sm text-brand-100">
          {photo.alt}
          <span className="ml-2 text-brand-300">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>
    </div>,
    document.body
  )
}
