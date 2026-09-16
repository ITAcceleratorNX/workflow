/**
 * Проигрывание видео по прокрутке — два способа, которые сравниваем на /lab/scroll-video:
 *
 * FrameSequence — ролик нарезан на кадры WebP и рисуется на canvas. Плавно в любом браузере,
 *   но кадров много: в памяти держим сжатые файлы, а декодируем только ближайшие.
 * VideoScrubber — обычный <video>, у которого по прокрутке меняется currentTime.
 *   Один файл, но плавность перемотки зависит от браузера.
 */

/** Скачивает файл целиком, сообщая прогресс. Без Content-Length total будет 0. */
export async function fetchWithProgress(
  url: string,
  onProgress: (loaded: number, total: number) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const response = await fetch(url, { signal })
  if (!response.ok || !response.body) throw new Error(`Не удалось загрузить ${url}: ${response.status}`)

  const total = Number(response.headers.get("Content-Length")) || 0
  const reader = response.body.getReader()
  const chunks: BlobPart[] = []
  let loaded = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value as BlobPart)
    loaded += value.byteLength
    onProgress(loaded, total)
  }

  return new Blob(chunks, { type: response.headers.get("Content-Type") ?? "" })
}

/** Рисует изображение на canvas как object-fit: cover — по центру, с обрезкой краёв */
export function drawCover(
  context: CanvasRenderingContext2D,
  image: ImageBitmap | HTMLVideoElement,
  width: number,
  height: number
) {
  const sourceWidth = image instanceof HTMLVideoElement ? image.videoWidth : image.width
  const sourceHeight = image instanceof HTMLVideoElement ? image.videoHeight : image.height
  if (!sourceWidth || !sourceHeight) return

  const scale = Math.max(width / sourceWidth, height / sourceHeight)
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

/* Сколько декодированных кадров держим одновременно: 48 × 1600×900 ≈ 280 МБ, 48 × 720×960 ≈ 130 МБ */
const DEFAULT_CACHE_SIZE = 48
/* Сколько кадров вперёд и назад декодируем заранее, пока человек прокручивает */
const DECODE_AHEAD = 6
/* Шаги прогрессивной загрузки: сначала редкие кадры по всему ролику, потом промежуточные */
const LOAD_STRIDES = [32, 16, 8, 4, 2, 1]

export class FrameSequence {
  readonly count: number
  /** Сколько кадров обработано загрузкой — включая недоступные, которые пропустили */
  settledCount = 0
  loadedBytes = 0
  /** Сколько раз нужного кадра ещё не было и показали соседний */
  misses = 0

  private readonly urlFor: (index: number) => string
  private readonly cacheSize: number
  private blobs: (Blob | undefined)[]
  private bitmaps = new Map<number, ImageBitmap>()
  private decoding = new Set<number>()
  private lastIndex = -1
  private disposed = false

  constructor(urlFor: (index: number) => string, count: number, cacheSize = DEFAULT_CACHE_SIZE) {
    this.urlFor = urlFor
    this.count = count
    this.cacheSize = cacheSize
    this.blobs = new Array(count)
  }

  /** Порядок загрузки: весь ролик становится доступен грубо и быстро, затем уточняется */
  private static loadOrder(count: number) {
    const order: number[] = []
    const added = new Set<number>()
    for (const stride of LOAD_STRIDES) {
      for (let index = 0; index < count; index += stride) {
        if (!added.has(index)) {
          added.add(index)
          order.push(index)
        }
      }
    }
    return order
  }

  /**
   * Загружает недостающие кадры. После прерывания (signal) повторный вызов
   * докачивает только то, чего ещё нет. Недоступный кадр пропускается —
   * вместо него покажется соседний, а загрузка не останавливается.
   */
  async load(onProgress?: () => void, signal?: AbortSignal, concurrency = 6) {
    const queue = FrameSequence.loadOrder(this.count).filter((index) => !this.blobs[index])

    const worker = async () => {
      while (queue.length && !this.disposed && !signal?.aborted) {
        const index = queue.shift()!
        try {
          const response = await fetch(this.urlFor(index), { signal })
          if (!response.ok) throw new Error(String(response.status))
          const blob = await response.blob()
          this.blobs[index] = blob
          this.loadedBytes += blob.size
        } catch {
          if (signal?.aborted) return
        }
        this.settledCount++
        onProgress?.()
      }
    }

    await Promise.all(Array.from({ length: concurrency }, worker))
  }

  /** Кадр для отрисовки: нужный, если он уже декодирован, иначе ближайший готовый */
  frameAt(index: number): ImageBitmap | undefined {
    const changed = index !== this.lastIndex
    this.lastIndex = index

    for (let offset = 0; offset <= DECODE_AHEAD; offset++) {
      this.decode(index + offset)
      if (offset) this.decode(index - offset)
    }

    const exact = this.bitmaps.get(index)
    if (exact) return exact
    if (changed) this.misses++

    for (let offset = 1; offset < this.count; offset++) {
      const nearest = this.bitmaps.get(index - offset) ?? this.bitmaps.get(index + offset)
      if (nearest) return nearest
    }
    return undefined
  }

  /** Освобождает декодированные кадры (самое тяжёлое в памяти), скачанные файлы остаются */
  releaseDecoded() {
    this.bitmaps.forEach((bitmap) => bitmap.close())
    this.bitmaps.clear()
    this.lastIndex = -1
  }

  dispose() {
    this.disposed = true
    this.releaseDecoded()
    this.blobs = []
  }

  private decode(index: number) {
    if (index < 0 || index >= this.count || this.bitmaps.has(index) || this.decoding.has(index)) return
    const blob = this.blobs[index]
    if (!blob) return

    this.decoding.add(index)
    createImageBitmap(blob)
      .then((bitmap) => {
        this.decoding.delete(index)
        if (this.disposed) return bitmap.close()
        this.bitmaps.set(index, bitmap)
        this.evictFarthest()
      })
      .catch(() => this.decoding.delete(index))
  }

  /** Освобождаем память от кадров, дальше всего отстоящих от текущего */
  private evictFarthest() {
    if (this.bitmaps.size <= this.cacheSize) return
    const byDistance = [...this.bitmaps.keys()].sort(
      (a, b) => Math.abs(b - this.lastIndex) - Math.abs(a - this.lastIndex)
    )
    for (const index of byDistance.slice(0, this.bitmaps.size - this.cacheSize)) {
      this.bitmaps.get(index)?.close()
      this.bitmaps.delete(index)
    }
  }
}

export class VideoScrubber {
  seeks = 0
  private seekLagTotal = 0
  private requestedAt = 0
  private pending: number | null = null
  private readonly video: HTMLVideoElement
  /* Разница меньше половины кадра — перематывать незачем */
  private readonly threshold: number

  constructor(video: HTMLVideoElement, fps: number) {
    this.video = video
    this.threshold = 0.5 / fps
    video.addEventListener("seeked", this.onSeeked)
  }

  /** Среднее время от команды перемотки до готового кадра, мс */
  get averageSeekLag() {
    return this.seeks ? this.seekLagTotal / this.seeks : 0
  }

  seek(time: number) {
    /* Пока браузер ищет предыдущий кадр, новые команды не копим — запоминаем только последнюю */
    if (this.video.seeking) {
      this.pending = time
      return
    }
    if (Math.abs(this.video.currentTime - time) < this.threshold) return
    this.requestedAt = performance.now()
    this.video.currentTime = time
  }

  dispose() {
    this.video.removeEventListener("seeked", this.onSeeked)
  }

  private onSeeked = () => {
    this.seeks++
    this.seekLagTotal += performance.now() - this.requestedAt
    if (this.pending !== null) {
      const next = this.pending
      this.pending = null
      this.seek(next)
    }
  }
}
