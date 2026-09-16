import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout, ScrollToTop } from "./components/layout/Layout"
import { LeadFormProvider } from "./components/lead/LeadFormProvider"
import { SmoothScrollProvider } from "./components/motion/SmoothScrollProvider"
import { HomePage } from "./pages/HomePage"
import { PropertyPage } from "./pages/PropertyPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { NotFoundPage } from "./pages/NotFoundPage"

/* CRM грузится отдельным файлом: посетителям сайта её код скачивать незачем */
const CrmPage = lazy(() => import("./crm/CrmPage"))

/* Витрина дизайн-системы - только для разработки: в продакшен-сборке условие
   становится false, и файл страницы в неё не попадает */
const StyleguidePage = import.meta.env.DEV ? lazy(() => import("./pages/StyleguidePage")) : null
const LabScrollVideoPage = import.meta.env.DEV ? lazy(() => import("./pages/LabScrollVideoPage")) : null

/** Публичный сайт: плавный скролл, общая шапка, подвал и модальная форма заявки. */
function SiteRoutes() {
  return (
    <SmoothScrollProvider>
      <LeadFormProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/time-square" element={<PropertyPage slug="time-square" />} />
            <Route path="/venus" element={<PropertyPage slug="venus" />} />
            <Route path="/koktem-towers" element={<PropertyPage slug="koktem-towers" />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </LeadFormProvider>
    </SmoothScrollProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* CRM живёт вне вёрстки сайта: без шапки, подвала, формы заявки и плавного скролла */}
        <Route
          path="/crm"
          element={
            <Suspense fallback={<div className="min-h-screen bg-brand-50" />}>
              <CrmPage />
            </Suspense>
          }
        />
        {StyleguidePage && (
          <Route
            path="/styleguide"
            element={
              <SmoothScrollProvider>
                <Suspense fallback={<div className="min-h-screen bg-graphite-950" />}>
                  <StyleguidePage />
                </Suspense>
              </SmoothScrollProvider>
            }
          />
        )}
        {LabScrollVideoPage && (
          <Route
            path="/lab/scroll-video"
            element={
              <SmoothScrollProvider>
                <Suspense fallback={<div className="min-h-screen bg-graphite-950" />}>
                  <LabScrollVideoPage />
                </Suspense>
              </SmoothScrollProvider>
            }
          />
        )}
        <Route path="*" element={<SiteRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
