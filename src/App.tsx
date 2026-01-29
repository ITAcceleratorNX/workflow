import { HeroSection } from "./components/HeroSection"
import { PortfolioSection } from "./components/PortfolioSection"
import { RatesSection } from "./components/RatesSection"
import { AdvantagesSection } from "./components/AdvantagesSection"
import { ContactFormSection } from "./components/ContactFormSection"
import { Footer } from "./components/Footer"

function App() {
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

export default App
