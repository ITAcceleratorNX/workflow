#!/usr/bin/env node
/**
 * Генерация иконок сайта из исходного знака.
 *
 * Исходники (public/app-icon*.webp) — это картинки в несколько тысяч пикселей
 * с большими прозрачными полями. Если отдать их браузеру как favicon, он сам
 * ужимает их до 16px и режет поля — знак получается мелким и мыльным.
 * Поэтому здесь мы обрезаем поля, приводим к квадрату и заранее рендерим
 * точные размеры качественным ресемплингом.
 *
 * Запуск: npm run generate-icons
 */
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const SOURCE_DARK = path.join(PUBLIC_DIR, 'app-icon.webp')
const SOURCE_WHITE = path.join(PUBLIC_DIR, 'app-icon-white.webp')

/** Доля поля вокруг знака в логотипе шапки и подвала — знак идёт без подложки. */
const LOGO_MARGIN = 0.04
/** Поле внутри плитки: сплошному фону нужен воздух, иначе знак упирается в углы. */
const TILE_MARGIN = 0.14
/** Скругление плитки во вкладке, доля стороны. */
const TILE_RADIUS = 0.18

/* Фирменный синий: плитка одинаково читается и на светлой, и на тёмной полосе вкладок,
   тогда как чёрный знак на прозрачном фоне в тёмной теме почти сливается. */
const BRAND = { r: 14, g: 53, b: 82, alpha: 1 }

/**
 * Обрезает прозрачные поля исходника и вписывает знак в квадрат с заданным полем.
 * Возвращает буфер PNG в максимальном разрешении — из него уже режем нужные размеры.
 */
async function squareLogo(source, margin, background) {
  const trimmed = await sharp(source)
    .trim({ threshold: 10 })
    .toBuffer({ resolveWithObject: true })

  const side = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * (1 + margin * 2))

  return sharp({
    create: { width: side, height: side, channels: 4, background },
  })
    .composite([{ input: trimmed.data, gravity: 'centre' }])
    .png()
    .toBuffer()
}

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

/** Скругляет углы готовой плитки. Радиус считаем от итогового размера, а не от исходника. */
async function rounded(buffer, size, radius) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`
  )
  return sharp(buffer)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

async function main() {
  /* Плитка: белый знак на фирменном синем */
  const tile = await squareLogo(SOURCE_WHITE, TILE_MARGIN, BRAND)
  const logoDark = await squareLogo(SOURCE_DARK, LOGO_MARGIN, TRANSPARENT)
  const logoWhite = await squareLogo(SOURCE_WHITE, LOGO_MARGIN, TRANSPARENT)

  const targets = [
    /* Вкладка браузера: три размера, чтобы браузер брал готовый, а не масштабировал сам */
    ...[16, 32, 48].map((size) => ({ buffer: tile, size, name: `favicon-${size}.png`, format: 'png', round: true })),
    /* iOS не понимает webp для apple-touch-icon — только png.
       Углы там скругляет сама система, поэтому отдаём ровный квадрат. */
    { buffer: tile, size: 180, name: 'apple-touch-icon.png', format: 'png' },
    /* Логотип в шапке и подвале: 40px в вёрстке, плюс 2x и 3x под плотные экраны */
    ...[40, 80, 120].map((size) => ({ buffer: logoDark, size, name: `logo-${size}.webp`, format: 'webp' })),
    ...[40, 80, 120].map((size) => ({ buffer: logoWhite, size, name: `logo-white-${size}.webp`, format: 'webp' })),
  ]

  for (const target of targets) {
    const out = path.join(PUBLIC_DIR, target.name)
    let buffer = await sharp(target.buffer)
      .resize(target.size, target.size, { kernel: 'lanczos3', fit: 'contain', background: TRANSPARENT })
      .png()
      .toBuffer()

    if (target.round) {
      buffer = await rounded(buffer, target.size, Math.round(target.size * TILE_RADIUS))
    }

    const pipeline =
      target.format === 'png'
        ? sharp(buffer).png({ compressionLevel: 9 })
        : sharp(buffer).webp({ quality: 92 })

    const { size } = await pipeline.toFile(out)
    console.log(`${target.name.padEnd(24)} ${target.size}x${target.size}  ${(size / 1024).toFixed(1)} КБ`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
