#!/usr/bin/env bash
#
# Подготовка видео для scroll-hero главной из исходника с дрона.
#
#   scripts/build-scroll-video.sh /путь/к/DJI_....mp4          - кадры для сайта
#   scripts/build-scroll-video.sh /путь/к/DJI_....mp4 --lab    - плюс варианты для /lab/scroll-video
#
# Шаги:
#   1. Уменьшаем 4K до 1920×1080 и берём кадры с частотой OUT_FPS / SPEED
#      на секунду исходника: при SPEED=1.5 и OUT_FPS=24 полёт идёт в полтора раза быстрее съёмки.
#   2. Разворачиваем порядок кадров - видео идёт от последней секунды к первой.
#      Фильтр reverse у ffmpeg держит весь ролик в памяти, поэтому переставляем номера кадров.
#   3. Кодируем каждый второй кадр в WebP: для широких экранов 1600×900,
#      для вертикальных - центральный кроп 720×960. Результат - public/scroll-hero/frames
#      и src/lib/scrollHeroFrames.ts с параметрами наборов.
#   4. С флагом --lab - ещё варианты для сравнения (кадры 1280 и H.264 для перемотки <video>).
#
# Переменные окружения: SPEED (1.5), OUT_FPS (24), WORK_DIR (.cache/scroll-video).
# Исходник (1,4 ГБ) в репозиторий не кладём - нужен только для пересборки.

set -euo pipefail

SRC=${1:?Укажите путь к исходному видео}
LAB=${2:-}
WORK_DIR=${WORK_DIR:-.cache/scroll-video}
SPEED=${SPEED:-1.5}
OUT_FPS=${OUT_FPS:-24}
SAMPLE_FPS=$(awk "BEGIN { print $OUT_FPS / $SPEED }")

FRAMES_DIR=public/scroll-hero/frames
FRAMES_TS=src/lib/scrollHeroFrames.ts
LAB_DIR=public/scroll-hero/lab

# Вертикальная версия - центральный кроп 3:4: на телефоне от 16:9 всё равно
# видна только середина, а качать ширину, которую обрежут, незачем
MOBILE_CROP="crop=810:1080,scale=720:960:flags=lanczos"

mkdir -p "$WORK_DIR/master" "$WORK_DIR/reversed"

echo "→ Кадры из исходника: ${SAMPLE_FPS} на секунду съёмки, 1920×1080"
if [ -z "$(ls -A "$WORK_DIR/master")" ]; then
  ffmpeg -v error -stats -y -hwaccel videotoolbox -i "$SRC" \
    -vf "fps=${SAMPLE_FPS},scale=1920:1080:flags=lanczos" \
    -pix_fmt yuvj420p -q:v 2 "$WORK_DIR/master/%05d.jpg"
else
  echo "  уже есть в $WORK_DIR/master - пропускаем (удалите папку, чтобы извлечь заново)"
fi

TOTAL=$(find "$WORK_DIR/master" -name '*.jpg' | wc -l | tr -d ' ')
echo "→ Разворот: $TOTAL кадров"
rm -f "$WORK_DIR/reversed/"*.jpg
for ((i = 1; i <= TOTAL; i++)); do
  ln -s "../master/$(printf %05d $((TOTAL - i + 1))).jpg" "$WORK_DIR/reversed/$(printf %05d "$i").jpg"
done

INPUT=(-framerate "$OUT_FPS" -i "$WORK_DIR/reversed/%05d.jpg")

# Каждый второй кадр (12 в секунду ускоренного полёта): плавно при прокрутке и вдвое легче
encode_frames() {
  local dir=$1 filter=$2 quality=$3
  echo "→ Кадры $dir"
  mkdir -p "$dir"
  rm -f "$dir/"*.webp
  ffmpeg -v error -stats -y "${INPUT[@]}" \
    -vf "select='not(mod(n\,2))',${filter}" -fps_mode vfr \
    -c:v libwebp -quality "$quality" -compression_level 4 -start_number 0 \
    "$dir/%04d.webp"
}

encode_frames "$FRAMES_DIR/wide" "scale=1600:900:flags=lanczos" 70
encode_frames "$FRAMES_DIR/tall" "$MOBILE_CROP" 68

echo "→ Параметры наборов: $FRAMES_TS"
node - "$FRAMES_DIR" "$FRAMES_TS" <<'NODE'
const fs = require("fs")
const path = require("path")
const [framesDir, tsFile] = process.argv.slice(2)

const describe = (name, width, height) => {
  const dir = path.join(framesDir, name)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".webp"))
  const bytes = files.reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0)
  return { path: `/scroll-hero/frames/${name}/`, count: files.length, width, height, bytes }
}

const sets = { wide: describe("wide", 1600, 900), tall: describe("tall", 720, 960) }

fs.writeFileSync(
  tsFile,
  `/* Файл создаёт scripts/build-scroll-video.sh - руками не править */

/** Наборы кадров scroll-hero: wide - для горизонтальных экранов, tall - для вертикальных */
export const SCROLL_HERO_FRAMES = ${JSON.stringify(sets, null, 2)} as const
`
)
for (const [name, set] of Object.entries(sets)) {
  console.log(`${name}: ${set.count} кадров, ${(set.bytes / 1048576).toFixed(1)} МБ`)
}
NODE

[ "$LAB" = "--lab" ] || exit 0

mkdir -p "$LAB_DIR"

# Видео для перемотки: без B-кадров и с ключевым кадром каждые $3 кадров -
# браузеру не нужно декодировать длинную цепочку, чтобы показать нужный момент
encode_video() {
  local name=$1 filter=$2 gop=$3 crf=$4
  echo "→ Видео $name"
  ffmpeg -v error -stats -y "${INPUT[@]}" -vf "${filter},format=yuv420p" \
    -c:v libx264 -preset slow -crf "$crf" -profile:v high \
    -x264-params "keyint=${gop}:min-keyint=${gop}:scenecut=0:bframes=0" \
    -movflags +faststart -an "$LAB_DIR/$name.mp4"
}

encode_video video-1920-g8 "scale=1920:1080" 8 24
encode_video video-1280-g8 "scale=1280:720:flags=lanczos" 8 24
encode_video video-1280-g1 "scale=1280:720:flags=lanczos" 1 26
encode_video video-mobile-g8 "$MOBILE_CROP" 8 25

encode_frames "$LAB_DIR/frames-1280" "scale=1280:720:flags=lanczos" 72
encode_frames "$LAB_DIR/frames-mobile" "$MOBILE_CROP" 68

echo "→ Манифест для страницы сравнения"
node - "$LAB_DIR" "$OUT_FPS" <<'NODE'
const fs = require("fs")
const path = require("path")
const [outDir, fps] = process.argv.slice(2)
const size = (file) => fs.statSync(file).size

const videos = fs.readdirSync(outDir).filter((f) => f.endsWith(".mp4")).sort().map((file) => ({
  id: path.basename(file, ".mp4"),
  kind: "video",
  src: `/scroll-hero/lab/${file}`,
  bytes: size(path.join(outDir, file)),
}))

const frames = fs.readdirSync(outDir).filter((f) => f.startsWith("frames-")).sort().map((dir) => {
  const files = fs.readdirSync(path.join(outDir, dir)).filter((f) => f.endsWith(".webp")).sort()
  return {
    id: dir,
    kind: "frames",
    pattern: `/scroll-hero/lab/${dir}/{index}.webp`,
    count: files.length,
    bytes: files.reduce((sum, f) => sum + size(path.join(outDir, dir, f)), 0),
  }
})

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify({ fps: Number(fps), variants: [...videos, ...frames] }, null, 2)
)
console.log([...videos, ...frames].map((v) => `${v.id}: ${(v.bytes / 1048576).toFixed(1)} МБ`).join("\n"))
NODE
