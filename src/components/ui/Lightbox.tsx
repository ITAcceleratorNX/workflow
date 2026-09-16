import { useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { PropertyPhoto } from "../../lib/properties"
import { useScrollLock } from "../../lib/smoothScroll"
import { useDialogFocus } from "../../lib/dialogFocus"

interface LightboxProps {
  photos: PropertyPhoto[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Просмотр увеличенного изображения галереи (раздел 8 ТЗ). */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index]
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  )
  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  )

  useScrollLock(Boolean(photo))
  useDialogFocus(rootRef, Boolean(photo), closeRef)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault()
        if (event.key === "ArrowLeft") goPrev()
        else goNext()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose, goPrev, goNext])

  if (!photo) return null

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      tabIndex={-1}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite-950/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
        aria-label="Закрыть просмотр"
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-graphite-950/70 text-ivory-50 transition-colors hover:border-white/50 hover:bg-graphite-900"
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
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-graphite-950/70 text-ivory-50 transition-colors hover:border-white/50 hover:bg-graphite-900 sm:left-6"
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
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-graphite-950/70 text-ivory-50 transition-colors hover:border-white/50 hover:bg-graphite-900 sm:right-6"
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
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
        />
        <figcaption aria-live="polite" aria-atomic="true" className="text-center text-sm text-graphite-300">
          {photo.alt}
          <span className="numeric ml-3 text-graphite-500">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>
    </div>,
    document.body
  )
}
