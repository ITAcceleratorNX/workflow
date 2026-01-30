import { Button } from "./ui/button"
import { openWhatsApp, WHATSAPP_MESSAGES } from "../lib/constants"

export function HeroSection() {
  const handleWhatsApp = () => {
    openWhatsApp(WHATSAPP_MESSAGES.hero)
  }

  return (
    <section className="w-full flex flex-col items-start px-4 md:px-[120px] py-8 md:py-[60px] animate-fade-in">
      <div 
        className="relative w-full rounded-[20px] md:rounded-[50px] overflow-hidden flex flex-col justify-end min-h-[400px] md:min-h-[709px] p-[40px_20px] md:p-[100px_49px] group subtle-glow"
        style={{ 
          backgroundImage: 'linear-gradient(180deg, rgba(30, 58, 95, 0.3) 0%, rgba(30, 58, 95, 0.6) 50%, rgba(201, 90, 26, 0.75) 100%), url(/og-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 20px 60px rgba(30, 58, 95, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundSize = '110%'
          e.currentTarget.style.boxShadow = '0 25px 70px rgba(30, 58, 95, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundSize = 'cover'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(30, 58, 95, 0.2)'
        }}
      >
        <div className="flex flex-col gap-4 md:gap-[35px] w-full max-w-full md:max-w-[863px] animate-fade-in-up">
          <div className="flex flex-col gap-3 md:gap-[15px] w-full max-w-full md:max-w-[863px]">
            <h1 
              className="text-white font-bold tracking-[-0.02em] text-2xl md:text-4xl lg:text-[64px] animate-slide-in-left text-elegant"
              style={{ 
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                lineHeight: '99%',
                width: '100%',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              Сервисные офисы премиум-класса
            </h1>
            <p 
              className="text-white/95 text-sm md:text-base lg:text-[20px] animate-slide-in-left"
              style={{ 
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                lineHeight: '27px',
                width: '100%',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                animationDelay: '0.2s'
              }}
            >
              All-inclusive пространства в центре делового г.Алматы с заездом от 2 недель и площадями от 20 до 10 000 м²
            </p>
          </div>
          <Button
            onClick={handleWhatsApp}
            className="flex items-center justify-center text-white font-normal w-full md:w-[313px] h-12 md:h-[68px] text-base md:text-xl lg:text-[24px] btn-animate relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #C95A1A 0%, #E67E22 100%)',
              borderRadius: '25px',
              padding: '20px 55px',
              gap: '10px',
              lineHeight: '28px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 500,
              animationDelay: '0.4s',
              boxShadow: '0 8px 24px rgba(201, 90, 26, 0.3)'
            }}
          >
            <span className="relative z-10">Связаться с нами</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
