import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HeroSection } from "./components/HeroSection"
import { PortfolioSection } from "./components/PortfolioSection"
import { RatesSection } from "./components/RatesSection"
import { AdvantagesSection } from "./components/AdvantagesSection"
import { ContactFormSection } from "./components/ContactFormSection"
import { Footer } from "./components/Footer"
import { ThankYouPage } from "./components/ThankYouPage"

function HomePage() {
  return (
    <div className="min-h-screen bg-white w-full max-w-[1440px] mx-auto relative">
      <HeroSection />
      <PortfolioSection />
      <RatesSection />
      <AdvantagesSection />
      <ContactFormSection />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
