import { useEffect, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { SITE_URL } from "../../lib/site"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

/** Возврат к началу страницы при переходе между объектами */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])

  return null
}

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
}

/** Обновляет существующий тег в <head>, а не добавляет дубль к разметке index.html. */
function upsertTag(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

const meta = (name: string, value: string) =>
  upsertTag(`meta[name="${name}"]`, () => {
    const el = document.createElement("meta")
    el.setAttribute("name", name)
    return el
  }, "content", value)

const ogMeta = (property: string, value: string) =>
  upsertTag(`meta[property="${property}"]`, () => {
    const el = document.createElement("meta")
    el.setAttribute("property", property)
    return el
  }, "content", value)

/**
 * Раздельные метаданные Title и Description для каждой страницы (раздел 11 ТЗ).
 * Теги обновляются на месте, поэтому в <head> не появляется дублей.
 */
export function Seo({ title, description, path, image = "/og-image.webp" }: SeoProps) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`
  const imageUrl = `${SITE_URL}${image}`

  useEffect(() => {
    document.title = title

    meta("description", description)
    meta("twitter:card", "summary_large_image")
    meta("twitter:title", title)
    meta("twitter:description", description)
    meta("twitter:image", imageUrl)

    ogMeta("og:type", "website")
    ogMeta("og:site_name", "TMK WorkFlow")
    ogMeta("og:locale", "ru_RU")
    ogMeta("og:title", title)
    ogMeta("og:description", description)
    ogMeta("og:url", url)
    ogMeta("og:image", imageUrl)

    upsertTag(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link")
        el.setAttribute("rel", "canonical")
        return el
      },
      "href",
      url
    )
  }, [title, description, url, imageUrl])

  return null
}
