import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PROPERTIES } from "../../lib/properties"

/** Мини-карта со всеми тремя БЦ: монохромная подложка, метки с названиями, без API-ключа. */
export function PropertiesMiniMap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const map = L.map(node, {
      scrollWheelZoom: false,
      // На телефоне жест над картой должен продолжать прокрутку страницы.
      dragging: !window.matchMedia("(pointer: coarse)").matches,
      touchZoom: false,
      doubleClickZoom: false,
      zoomControl: false,
      attributionControl: true,
      zoomSnap: 0.25,
    })

    L.control.zoom({
      position: "bottomright",
      zoomInTitle: "Приблизить карту",
      zoomOutTitle: "Отдалить карту",
    }).addTo(map)

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

    const fitMap = () => {
      map.invalidateSize({ pan: false, animate: false })
      map.fitBounds(bounds, {
        // Учитываем ширину подписей и высоту меток, а не только координаты точек.
        paddingTopLeft: [88, 80],
        paddingBottomRight: [88, 48],
        maxZoom: 16,
        animate: false,
      })
    }

    fitMap()
    const observer = new ResizeObserver(fitMap)
    observer.observe(node)

    return () => {
      observer.disconnect()
      map.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="map-muted relative isolate z-0 h-full w-full [&_.leaflet-control-zoom_a]:!h-11 [&_.leaflet-control-zoom_a]:!w-11 [&_.leaflet-control-zoom_a]:!leading-[44px]"
      role="region"
      aria-label="Карта Алматы с бизнес-центрами Time Square, Venus и Koktem Towers"
    />
  )
}
