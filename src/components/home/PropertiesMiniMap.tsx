import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PROPERTIES } from "../../lib/properties"

/** Мини-карта со всеми тремя БЦ: метки с названиями, без API-ключа. */
export function PropertiesMiniMap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const map = L.map(node, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const bounds = L.latLngBounds([])

    for (const property of PROPERTIES) {
      const point = L.latLng(property.map.lat, property.map.lng)
      bounds.extend(point)

      const icon = L.divIcon({
        className: "bc-map-marker",
        html: `<div class="bc-map-marker__wrap">
          <span class="bc-map-marker__label">${property.name}</span>
          <span class="bc-map-marker__pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
              <path d="M6 12h12"/>
              <path d="M6 16h12"/>
              <path d="M10 6h.01"/>
              <path d="M14 6h.01"/>
              <path d="M10 10h.01"/>
              <path d="M14 10h.01"/>
            </svg>
          </span>
        </div>`,
        iconSize: [140, 56],
        iconAnchor: [70, 52],
      })

      L.marker(point, { icon, interactive: false, keyboard: false }).addTo(map)
    }

    map.fitBounds(bounds.pad(0.45))

    const onResize = () => map.invalidateSize()
    window.addEventListener("resize", onResize)
    const resizeTimer = window.setTimeout(onResize, 80)

    return () => {
      window.clearTimeout(resizeTimer)
      window.removeEventListener("resize", onResize)
      map.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[320px] w-full overflow-hidden rounded-3xl border border-brand-100 bg-brand-50 shadow-card sm:min-h-[420px]"
      role="img"
      aria-label="Карта Алматы с бизнес-центрами Time Square, Venus и Koktem Towers"
    />
  )
}
