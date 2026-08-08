import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout, ScrollToTop } from "./components/layout/Layout"
import { LeadFormProvider } from "./components/lead/LeadFormProvider"
import { HomePage } from "./pages/HomePage"
import { PropertyPage } from "./pages/PropertyPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { NotFoundPage } from "./pages/NotFoundPage"

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
    </BrowserRouter>
  )
}
