import { Button } from "./ui/button"
import { openWhatsApp, WHATSAPP_MESSAGES } from "../lib/constants"

export function HeroSection() {
  const handleWhatsApp = () => {
    openWhatsApp(WHATSAPP_MESSAGES.hero)
  }

  return (
    <section className="w-full flex flex-col items-start px-4 md:px-[120px] py-8 md:py-[60px]">
      <div 
        className="relative w-full rounded-[20px] md:rounded-[50px] overflow-hidden flex flex-col justify-end min-h-[400px] md:min-h-[709px] p-[40px_20px] md:p-[100px_49px]"
        style={{ 
          backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=709&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex flex-col gap-4 md:gap-[35px] w-full max-w-full md:max-w-[863px]">
          <div className="flex flex-col gap-3 md:gap-[15px] w-full max-w-full md:max-w-[863px]">
            <h1 
              className="text-white font-bold tracking-[-0.02em] text-2xl md:text-4xl lg:text-[64px]"
              style={{ 
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                lineHeight: '99%',
                width: '100%'
              }}
            >
              Сервисные офисы премиум-класса
            </h1>
            <p 
              className="text-[#DDDDDD] text-sm md:text-base lg:text-[20px]"
              style={{ 
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                lineHeight: '27px',
                width: '100%'
              }}
            >
              All-inclusive пространства в центре делового Алматы с заездом от 2 недель и площадями от 20 до 10 000 м²
            </p>
          </div>
          <Button
            onClick={handleWhatsApp}
            className="flex items-center justify-center text-white font-normal w-full md:w-[313px] h-12 md:h-[68px] text-base md:text-xl lg:text-[24px]"
            style={{
              background: '#B8400E',
              borderRadius: '25px',
              padding: '20px 55px',
              gap: '10px',
              lineHeight: '28px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400
            }}
          >
            Связаться с нами
          </Button>
        </div>
      </div>
    </section>
  )
}
