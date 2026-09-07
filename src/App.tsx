import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout, ScrollToTop } from "./components/layout/Layout"
import { LeadFormProvider } from "./components/lead/LeadFormProvider"
import { HomePage } from "./pages/HomePage"
import { PropertyPage } from "./pages/PropertyPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { NotFoundPage } from "./pages/NotFoundPage"

/* CRM грузится отдельным файлом: посетителям сайта её код скачивать незачем */
const CrmPage = lazy(() => import("./crm/CrmPage"))

/** Публичный сайт: общая шапка, подвал и модальная форма заявки. */
function SiteRoutes() {
  return (
    <LeadFormProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venus" element={<PropertyPage slug="venus" />} />
          <Route path="/koktem-towers" element={<PropertyPage slug="koktem-towers" />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </LeadFormProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* CRM живёт вне вёрстки сайта: без шапки, подвала и формы заявки */}
        <Route
          path="/crm"
          element={
            <Suspense fallback={<div className="min-h-screen bg-brand-50" />}>
              <CrmPage />
            </Suspense>
          }
        />
        <Route path="*" element={<SiteRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
