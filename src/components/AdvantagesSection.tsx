import { MapPin, Zap, Clock, Square, CheckSquare, Wifi } from "lucide-react"

const advantages = [
  {
    icon: MapPin,
    text: "ПРЕМИАЛЬНЫЕ ЛОКАЦИИ В ДЕЛОВЫХ ЦЕНТРАХ АЛМАТЫ",
  },
  {
    icon: Zap,
    text: "ALL-INCLUSIVE СЕРВИС",
  },
  {
    icon: Clock,
    text: "БЫСТРЫЙ ЗАЕЗД ОТ 2 НЕДЕЛЬ",
  },
  {
    icon: Square,
    text: "ГИБКОСТЬ ФОРМАТОВ ОТ 20 ДО 10 000 М²",
  },
  {
    icon: CheckSquare,
    text: "СТАНДАРТИЗИРОВАННАЯ ИНФРАСТРУКТУРА",
  },
  {
    icon: Wifi,
    text: "SMART ОФИСЫ",
  },
]

export function AdvantagesSection() {
  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[100px]">
      <div className="flex flex-col gap-8 md:gap-16 w-full max-w-[1200px] mx-auto">
        <h2 
          className="font-bold text-center text-[#202124] tracking-[-2px] text-2xl md:text-4xl lg:text-[64px]"
          style={{ 
            lineHeight: '64px',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700
          }}
        >
          НАШЕ ПРЕИМУЩЕСТВА
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div 
                key={index} 
                className="flex flex-col items-center gap-4 md:gap-6"
              >
                <div 
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '64px',
                    height: '64px',
                    background: '#F7F8FA',
                    padding: '12px'
                  }}
                >
                  <Icon 
                    className="text-[#B8400E]" 
                    style={{ width: '40px', height: '40px', strokeWidth: 2 }}
                  />
                </div>
                <h3 
                  className="font-bold text-center text-[#202124] uppercase text-sm md:text-lg lg:text-[24px]"
                  style={{ 
                    lineHeight: '32px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    margin: 0,
                    padding: 0,
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1,
                    color: '#202124',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflow: 'visible'
                  }}
                >
                  {advantage.text}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
