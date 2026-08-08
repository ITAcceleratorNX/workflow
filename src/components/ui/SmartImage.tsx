import { useState } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "../../lib/utils"

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  /** Запасное изображение, если основной файл ещё не загружен в public/ */
  fallbackSrc?: string
  /** Подпись на заглушке, когда изображения нет */
  placeholderLabel?: string
  priority?: boolean
  sizes?: string
}

/**
 * Изображение с отложенной загрузкой и мягкой деградацией: если файла нет,
 * вместо битой картинки показывается подписанная заглушка и вёрстка не ломается.
 *
 * Состояние загрузки привязано к конкретному src, поэтому в местах, где src
 * может меняться без размонтирования, передавайте `key={src}`.
 */
export function SmartImage({
  src,
  alt,
  className,
  fallbackSrc,
  placeholderLabel,
  priority = false,
  sizes,
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-100 to-brand-200 p-4 text-center",
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-brand-500" aria-hidden="true" />
        <span className="text-xs font-medium text-brand-700">
          {placeholderLabel ?? "Фото будет добавлено"}
        </span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
        else setFailed(true)
      }}
      className={cn("h-full w-full object-cover", className)}
    />
  )
}
