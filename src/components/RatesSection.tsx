export function RatesSection() {
  return (
    <section
      className="w-full px-4 py-12 animate-fade-in-up"
      style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)' }}
    >
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
        <h2
          className="font-bold text-center text-base md:text-[24px] text-elegant animate-slide-in-left md:leading-[38px]"
          style={{
            lineHeight: '24px',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            margin: 0,
            color: '#1E3A5F',
            width: '100%',
          }}
        >
          Тарифы аренды
        </h2>

        <p
          className="text-center text-xs md:text-[24px] w-full animate-fade-in-up md:leading-[38px]"
          style={{
            lineHeight: '18px',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 400,
            margin: 0,
            color: '#2C3E50',
            animationDelay: '0.2s',
          }}
        >
          Гибкие условия в зависимости от состояния и уровня оснащения офиса.
        </p>

        {/* Единая версия (как на телефонах) для всех размеров */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-row items-center justify-between w-full py-2 border-b border-gray-200">
            <div 
              className="text-[14px] md:text-[24px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
              }}
            >
              В текущем состоянии
            </div>
            <div 
              className="font-semibold text-[14px] md:text-[30px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
              }}
            >
              от 15 000 тг/м²
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full py-2 border-b border-gray-200">
            <div 
              className="text-[14px] md:text-[24px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
              }}
            >
              С мебелью, ремонтом
            </div>
            <div 
              className="font-semibold text-[14px] md:text-[30px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
              }}
            >
              от 18 000 тг/м²
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full py-2">
            <div 
              className="text-[14px] md:text-[24px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
              }}
            >
              С мебелью, ремонтом и сервисом
            </div>
            <div 
              className="font-semibold text-[14px] md:text-[30px] leading-[20px] md:leading-[38px] transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
              }}
            >
              от 25 000 тг/м²
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
