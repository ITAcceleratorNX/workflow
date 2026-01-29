import { Button } from "./ui/button"
import { openWhatsApp, WHATSAPP_MESSAGES } from "../lib/constants"

const offices = [
  {
    id: 1,
    name: "Teniz Towers",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Orion",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Nurlytau",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Venus",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
  },
]

export function PortfolioSection() {
  const handleDetails = (officeName: string) => {
    openWhatsApp(WHATSAPP_MESSAGES.portfolio(officeName))
  }

  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[100px]">
      <div className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-full md:max-w-[896px]">
          <h2 
            className="font-bold text-center text-black tracking-[-0.02em] text-xl md:text-3xl lg:text-[64px] leading-tight md:leading-[64px]"
            style={{ 
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700
            }}
          >
            ПОРТФЕЛЬ ОФИСНЫХ ПРОСТРАНСТВ
          </h2>
          <p 
            className="text-center text-black text-sm md:text-base max-w-full md:max-w-[710px]"
            style={{ 
              fontSize: '16px',
              lineHeight: '22px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400
            }}
          >
            Наши пространства созданы для компаний, которым важны сервис, инфраструктура и рабочие решения, поддерживающие рост и эффективность.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-[1200px]">
          {offices.map((office) => (
            <div
              key={office.id}
              className="relative flex flex-col justify-end items-center rounded-[20px] md:rounded-[50px] overflow-hidden min-h-[250px] md:min-h-[300px] p-5 md:p-[35px_83px]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0) 26.44%, rgba(255, 255, 255, 0.5) 92.79%), url(${office.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex flex-col items-center gap-3 md:gap-[15px] w-full max-w-full md:max-w-[195px]">
                <h3 
                  className="font-bold text-center text-[#040404] text-base md:text-xl lg:text-[24px]"
                  style={{ 
                    lineHeight: '33px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700
                  }}
                >
                  {office.name}
                </h3>
                <Button
                  onClick={() => handleDetails(office.name)}
                  className="flex items-center justify-center bg-white text-black font-normal text-xs md:text-sm lg:text-[13.9px]"
                  style={{
                    borderRadius: '50px',
                    padding: '11px 43px',
                    lineHeight: '19px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Подробнее
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
