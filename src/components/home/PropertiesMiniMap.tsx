import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PROPERTIES } from "../../lib/properties"

/** Мини-карта со всеми тремя БЦ сразу — без интерактива по клику на маркеры. */
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

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 18,
    }).addTo(map)

    const buildingIcon = L.divIcon({
      className: "bc-map-marker",
      html: `<span class="bc-map-marker__pin" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12h12"/>
          <path d="M6 16h12"/>
          <path d="M10 6h.01"/>
          <path d="M14 6h.01"/>
          <path d="M10 10h.01"/>
          <path d="M14 10h.01"/>
        </svg>
      </span>`,
      iconSize: [40, 40],
      iconAnchor: [20, 36],
    })

    const bounds = L.latLngBounds([])
    for (const property of PROPERTIES) {
      const point = L.latLng(property.map.lat, property.map.lng)
      bounds.extend(point)
      L.marker(point, { icon: buildingIcon, interactive: false, keyboard: false })
        .bindTooltip(property.name, {
          permanent: true,
          direction: "top",
          offset: [0, -34],
          className: "bc-map-tooltip",
        })
        .addTo(map)
    }

    map.fitBounds(bounds.pad(0.35))

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
