import { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { HERO_CLIPS } from "../../lib/homeContent"

const FADE_MS = 900
const CLIP_MS = 5200

/**
 * Динамичная нарезка для Hero: плавная смена коротких клипов (дрон + интерьеры).
 * Два слоя video с кроссфейдом.
 */
export function HeroVideoMontage() {
  const [layer, setLayer] = useState<0 | 1>(0)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  )
  const [saveData, setSaveData] = useState(() => {
    if (typeof navigator === "undefined") return false
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    return Boolean(connection?.saveData)
  })
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReducedMotion(motion.matches)
    motion.addEventListener("change", onChange)
    return () => motion.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void }
    }).connection
    if (!connection?.addEventListener) return

    const onChange = () => setSaveData(Boolean(connection.saveData))
    connection.addEventListener("change", onChange)
    return () => connection.removeEventListener?.("change", onChange)
  }, [])

  const showVideo = !reducedMotion && !saveData
  const poster = HERO_CLIPS[0].poster

  useEffect(() => {
    if (!showVideo) return

    const playLayer = (el: HTMLVideoElement | null, clipIndex: number) => {
      if (!el) return
      const clip = HERO_CLIPS[clipIndex]
      el.pause()
      while (el.firstChild) el.removeChild(el.firstChild)

      const webm = document.createElement("source")
      webm.src = clip.webm
      webm.type = "video/webm"
      const mp4 = document.createElement("source")
      mp4.src = clip.mp4
      mp4.type = "video/mp4"
      el.appendChild(webm)
      el.appendChild(mp4)
      el.load()

      const play = el.play()
      if (play && typeof play.catch === "function") play.catch(() => {})
    }

    playLayer(aRef.current, 0)

    const timer = window.setInterval(() => {
      const next = (indexRef.current + 1) % HERO_CLIPS.length
      indexRef.current = next
      setLayer((prev) => {
        const nextLayer = prev === 0 ? 1 : 0
        playLayer(nextLayer === 0 ? aRef.current : bRef.current, next)
        return nextLayer
      })
    }, CLIP_MS)

    return () => window.clearInterval(timer)
  }, [showVideo])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-brand-950"
      aria-hidden="true"
    >
      <img
        src={poster}
        alt=""
        className={cn(
          "absolute inset-0 block h-full w-full min-h-full min-w-full scale-[1.03] object-cover transition-opacity duration-700",
          showVideo ? "opacity-0" : "opacity-100"
        )}
      />

      {showVideo && (
        <>
          <video
            ref={aRef}
            muted
            playsInline
            autoPlay
            preload="auto"
            className={cn(
              "absolute inset-0 block h-full w-full min-h-full min-w-full scale-[1.03] object-cover transition-opacity ease-out",
              layer === 0 ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
          <video
            ref={bRef}
            muted
            playsInline
            preload="auto"
            className={cn(
              "absolute inset-0 block h-full w-full min-h-full min-w-full scale-[1.03] object-cover transition-opacity ease-out",
              layer === 1 ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
        </>
      )}

      {/* Равномерное затемнение фона ~35–40% */}
      <div className="absolute inset-0 bg-brand-950/40" />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  )
}
