#!/usr/bin/env bash
#
# Подготовка видео для scroll-hero главной из исходника с дрона.
#
#   scripts/build-scroll-video.sh /путь/к/DJI_....mp4 [папка_результата]
#
# Шаги:
#   1. Уменьшаем 4K до 1920×1080 и берём кадры с частотой OUT_FPS / SPEED
#      на секунду исходника: при SPEED=1.5 и OUT_FPS=24 полёт идёт в полтора раза быстрее съёмки.
#   2. Разворачиваем порядок кадров — видео идёт от последней секунды к первой.
#      Фильтр reverse у ffmpeg держит весь ролик в памяти, поэтому переставляем номера кадров.
#   3. Кодируем варианты для сравнения на странице /lab/scroll-video:
#      кадры WebP для canvas и H.264 с частыми ключевыми кадрами для перемотки <video>.
#
# Переменные окружения: SPEED (1.5), OUT_FPS (24), WORK_DIR (.cache/scroll-video).
# Исходник (1,4 ГБ) в репозиторий не кладём — нужен только для пересборки.

set -euo pipefail

SRC=${1:?Укажите путь к исходному видео}
OUT_DIR=${2:-public/scroll-hero/lab}
WORK_DIR=${WORK_DIR:-.cache/scroll-video}
SPEED=${SPEED:-1.5}
OUT_FPS=${OUT_FPS:-24}
SAMPLE_FPS=$(awk "BEGIN { print $OUT_FPS / $SPEED }")

# Мобильная версия — центральный кроп 3:4: на вертикальном экране от 16:9 всё равно
# видна только середина, а качать ширину, которую обрежут, незачем
MOBILE_CROP="crop=810:1080,scale=720:960:flags=lanczos"

mkdir -p "$WORK_DIR/master" "$WORK_DIR/reversed" "$OUT_DIR"

echo "→ Кадры из исходника: ${SAMPLE_FPS} на секунду съёмки, 1920×1080"
if [ -z "$(ls -A "$WORK_DIR/master")" ]; then
  ffmpeg -v error -stats -y -hwaccel videotoolbox -i "$SRC" \
    -vf "fps=${SAMPLE_FPS},scale=1920:1080:flags=lanczos" \
    -pix_fmt yuvj420p -q:v 2 "$WORK_DIR/master/%05d.jpg"
else
  echo "  уже есть в $WORK_DIR/master — пропускаем (удалите папку, чтобы извлечь заново)"
fi

TOTAL=$(find "$WORK_DIR/master" -name '*.jpg' | wc -l | tr -d ' ')
echo "→ Разворот: $TOTAL кадров"
rm -f "$WORK_DIR/reversed/"*.jpg
for ((i = 1; i <= TOTAL; i++)); do
  ln -s "../master/$(printf %05d $((TOTAL - i + 1))).jpg" "$WORK_DIR/reversed/$(printf %05d "$i").jpg"
done

INPUT=(-framerate "$OUT_FPS" -i "$WORK_DIR/reversed/%05d.jpg")

# Видео для перемотки: без B-кадров и с ключевым кадром каждые $1 кадров —
# браузеру не нужно декодировать длинную цепочку, чтобы показать нужный момент
encode_video() {
  local name=$1 filter=$2 gop=$3 crf=$4
  echo "→ Видео $name"
  ffmpeg -v error -stats -y "${INPUT[@]}" -vf "${filter},format=yuv420p" \
    -c:v libx264 -preset slow -crf "$crf" -profile:v high \
    -x264-params "keyint=${gop}:min-keyint=${gop}:scenecut=0:bframes=0" \
    -movflags +faststart -an "$OUT_DIR/$name.mp4"
}

encode_video video-1920-g8 "scale=1920:1080" 8 24
encode_video video-1280-g8 "scale=1280:720:flags=lanczos" 8 24
encode_video video-1280-g1 "scale=1280:720:flags=lanczos" 1 26
encode_video video-mobile-g8 "$MOBILE_CROP" 8 25

# Кадры для canvas: каждый второй кадр (12 в секунду ускоренного полёта) — иначе их слишком много
encode_frames() {
  local name=$1 filter=$2 quality=$3
  echo "→ Кадры $name"
  mkdir -p "$OUT_DIR/$name"
  rm -f "$OUT_DIR/$name/"*.webp
  ffmpeg -v error -stats -y "${INPUT[@]}" \
    -vf "select='not(mod(n\,2))',${filter}" -fps_mode vfr \
    -c:v libwebp -quality "$quality" -compression_level 4 -start_number 0 \
    "$OUT_DIR/$name/%04d.webp"
}

encode_frames frames-1280 "scale=1280:720:flags=lanczos" 72
encode_frames frames-mobile "$MOBILE_CROP" 68

echo "→ Манифест для страницы сравнения"
node - "$OUT_DIR" "$OUT_FPS" <<'NODE'
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
