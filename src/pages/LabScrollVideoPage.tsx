import { useEffect, useRef, useState, type MutableRefObject } from "react"
import { FrameSequence, VideoScrubber, drawCover, fetchWithProgress } from "../lib/scrollMedia"
import { ScrollTrigger, gsap, useGSAP } from "../lib/motion"
import { cn } from "../lib/utils"

/**
 * Лаборатория (только в режиме разработки, /lab/scroll-video): сравнение способов
 * проиграть ролик по прокрутке. Варианты готовит scripts/build-scroll-video.sh.
 */

interface VideoVariant {
  id: string
  kind: "video"
  src: string
  bytes: number
}

interface FramesVariant {
  id: string
  kind: "frames"
  pattern: string
  count: number
  bytes: number
}

type Variant = VideoVariant | FramesVariant

interface Manifest {
  fps: number
  variants: Variant[]
}

interface Stats {
  loadedBytes: number
  totalBytes: number
  loadSeconds: number | null
  position: string
  quality: string
}

const DESCRIPTIONS: Record<string, string> = {
  "video-1920-g8": "Видео 1920×1080, ключевой кадр каждые 8",
  "video-1280-g8": "Видео 1280×720, ключевой кадр каждые 8",
  "video-1280-g1": "Видео 1280×720, каждый кадр ключевой",
  "video-mobile-g8": "Видео для телефона 720×960",
  "frames-1280": "Кадры WebP 1280×720 на canvas",
  "frames-mobile": "Кадры WebP для телефона 720×960",
}

const SCREENS = [3, 5, 8]
const mb = (bytes: number) => `${(bytes / 1048576).toFixed(1)} МБ`
const EMPTY_STATS: Stats = { loadedBytes: 0, totalBytes: 0, loadSeconds: null, position: "—", quality: "—" }

/** Прогресс прокрутки сцены 0…1 и сглаженное значение, которое реально показываем */
interface ProgressRefs {
  target: MutableRefObject<number>
  smoothing: MutableRefObject<boolean>
}

function useSmoothedProgress({ target, smoothing }: ProgressRefs, onFrame: (progress: number) => void) {
  const callbackRef = useRef(onFrame)

  useEffect(() => {
    callbackRef.current = onFrame
  })

  useEffect(() => {
    let shown = target.current
    const tick = () => {
      shown = smoothing.current ? shown + (target.current - shown) * 0.12 : target.current
      callbackRef.current(shown)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [target, smoothing])
}

function FramesPlayer({
  variant,
  progress,
  onStats,
}: {
  variant: FramesVariant
  progress: ProgressRefs
  onStats: (stats: Stats) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sequenceRef = useRef<FrameSequence | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const started = performance.now()
    const sequence = new FrameSequence((index) => variant.pattern.replace("{index}", String(index).padStart(4, "0")), variant.count)
    sequenceRef.current = sequence
    let loadSeconds: number | null = null

    sequence.load(undefined, controller.signal).then(
      () => (loadSeconds = (performance.now() - started) / 1000),
      () => {}
    )

    const report = window.setInterval(() => {
      onStats({
        loadedBytes: sequence.loadedBytes,
        totalBytes: variant.bytes,
        loadSeconds,
        position: `кадр ${indexRef.current + 1} из ${variant.count} · загружено ${sequence.loadedCount}`,
        quality: `промахов декодирования: ${sequence.misses}`,
      })
    }, 250)

    return () => {
      controller.abort()
      window.clearInterval(report)
      sequence.dispose()
    }
  }, [variant, onStats])

  useSmoothedProgress(progress, (value) => {
    const canvas = canvasRef.current
    const sequence = sequenceRef.current
    if (!canvas || !sequence) return

    /* Размер буфера под плотность экрана (не выше 2x — дальше разницы не видно, а памяти больше) */
    const ratio = Math.min(window.devicePixelRatio, 2)
    const width = Math.round(canvas.clientWidth * ratio)
    const height = Math.round(canvas.clientHeight * ratio)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    const index = Math.round(value * (sequence.count - 1))
    indexRef.current = index
    const frame = sequence.frameAt(index)
    const context = canvas.getContext("2d")
    if (frame && context) drawCover(context, frame, width, height)
  })

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}

function VideoPlayer({
  variant,
  fps,
  progress,
  onStats,
}: {
  variant: VideoVariant
  fps: number
  progress: ProgressRefs
  onStats: (stats: Stats) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubberRef = useRef<VideoScrubber | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const controller = new AbortController()
    const started = performance.now()
    let loadedBytes = 0
    let loadSeconds: number | null = null
    let objectUrl = ""
    const scrubber = new VideoScrubber(video, fps)

    /* Файл целиком в память: перемотка по blob не ждёт сети, как у pgreenhomes */
    fetchWithProgress(variant.src, (loaded) => (loadedBytes = loaded), controller.signal)
      .then((blob) => {
        loadSeconds = (performance.now() - started) / 1000
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        /* iOS показывает кадры при перемотке только после первого play() */
        video.play().then(() => video.pause(), () => {})
        scrubberRef.current = scrubber
      })
      .catch(() => {})

    const report = window.setInterval(() => {
      onStats({
        loadedBytes,
        totalBytes: variant.bytes,
        loadSeconds,
        position: `${video.currentTime.toFixed(2)} из ${(video.duration || 0).toFixed(1)} с`,
        quality: `перемоток: ${scrubber.seeks} · средняя задержка ${scrubber.averageSeekLag.toFixed(0)} мс`,
      })
    }, 250)

    return () => {
      controller.abort()
      window.clearInterval(report)
      scrubber.dispose()
      scrubberRef.current = null
      video.removeAttribute("src")
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [variant, fps, onStats])

  useSmoothedProgress(progress, (value) => {
    const video = videoRef.current
    const scrubber = scrubberRef.current
    if (video && scrubber && video.duration) scrubber.seek(value * video.duration)
  })

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export default function LabScrollVideoPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState("")
  const [variantId, setVariantId] = useState("")
  const [screens, setScreens] = useState(5)
  const [smooth, setSmooth] = useState(true)
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [fps, setFps] = useState(0)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const smoothing = useRef(smooth)

  useEffect(() => {
    smoothing.current = smooth
  }, [smooth])

  useEffect(() => {
    fetch("/scroll-hero/lab/manifest.json")
      .then((response) => {
        if (!response.ok) throw new Error("manifest")
        return response.json() as Promise<Manifest>
      })
      .then((data) => {
        setManifest(data)
        const narrow = window.innerWidth < 768
        const preferred = narrow ? "frames-mobile" : "frames-1280"
        setVariantId(data.variants.some((v) => v.id === preferred) ? preferred : data.variants[0].id)
      })
      .catch(() =>
        setError("Нет вариантов: запустите scripts/build-scroll-video.sh /путь/к/исходнику.mp4")
      )
  }, [])

  /* Счётчик кадров отрисовки: видно, успевает ли страница за прокруткой */
  useEffect(() => {
    let frames = 0
    let frame = requestAnimationFrame(function count() {
      frames++
      frame = requestAnimationFrame(count)
    })
    const report = window.setInterval(() => {
      setFps(frames)
      frames = 0
    }, 1000)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(report)
    }
  }, [])

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => (target.current = self.progress),
      })
      return () => trigger.kill()
    },
    { dependencies: [screens, manifest], revertOnUpdate: true }
  )

  const variant = manifest?.variants.find((v) => v.id === variantId)
  const progress = { target, smoothing }

  return (
    <div className="bg-graphite-950 text-ivory-50">
      <div ref={wrapperRef} className="relative" style={{ height: `${screens * 100}svh` }}>
        <div className="sticky top-0 h-svh overflow-hidden">
          {variant?.kind === "frames" && (
            <FramesPlayer key={variant.id} variant={variant} progress={progress} onStats={setStats} />
          )}
          {variant?.kind === "video" && manifest && (
            <VideoPlayer key={variant.id} variant={variant} fps={manifest.fps} progress={progress} onStats={setStats} />
          )}

          <div className="absolute left-3 top-3 z-10 w-[min(22rem,calc(100vw-1.5rem))] space-y-3 rounded-2xl bg-graphite-950/85 p-4 text-sm backdrop-blur-md">
            <p className="label text-ochre-400">Лаборатория · видео по прокрутке</p>
            {error && <p className="text-ochre-300">{error}</p>}

            {manifest && (
              <>
                <div className="space-y-1">
                  {manifest.variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVariantId(item.id)}
                      className={cn(
                        "flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
                        item.id === variantId ? "bg-ochre-500 text-graphite-950" : "hover:bg-white/10"
                      )}
                    >
                      <span>{DESCRIPTIONS[item.id] ?? item.id}</span>
                      <span className="numeric shrink-0 opacity-70">{mb(item.bytes)}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-graphite-400">Длина сцены:</span>
                  {SCREENS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setScreens(value)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5",
                        value === screens ? "bg-ivory-50 text-graphite-950" : "bg-white/10"
                      )}
                    >
                      {value} экранов
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={smooth} onChange={(event) => setSmooth(event.target.checked)} />
                  Сглаживание (догоняет прокрутку)
                </label>

                <div className="numeric space-y-0.5 border-t border-white/10 pt-3 text-graphite-300">
                  <p>
                    Загружено: {mb(stats.loadedBytes)} из {mb(stats.totalBytes)}
                    {stats.loadSeconds !== null && ` за ${stats.loadSeconds.toFixed(1)} с`}
                  </p>
                  <p>{stats.position}</p>
                  <p>{stats.quality}</p>
                  <p>Отрисовка: {fps} кадров/с</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-svh items-center justify-center text-graphite-400">Конец сцены</div>
    </div>
  )
}
