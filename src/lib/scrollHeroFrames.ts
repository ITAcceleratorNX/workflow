/* Файл создаёт scripts/build-scroll-video.sh — руками не править */

/** Наборы кадров scroll-hero: wide — для горизонтальных экранов, tall — для вертикальных */
export const SCROLL_HERO_FRAMES = {
  "wide": {
    "path": "/scroll-hero/frames/wide/",
    "count": 770,
    "width": 1600,
    "height": 900,
    "bytes": 16262380
  },
  "tall": {
    "path": "/scroll-hero/frames/tall/",
    "count": 770,
    "width": 720,
    "height": 960,
    "bytes": 10239638
  }
} as const
