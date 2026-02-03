export function RatesSection() {
  return (
    <section className="w-full px-4 md:px-[120px] py-12 md:py-[100px] animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)' }}>
      <div className="flex flex-col gap-6 md:gap-7 w-full max-w-[1200px] mx-auto md:px-[80px]">
        {/* Заголовок - по центру на мобильных */}
        <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-5 w-full animate-slide-in-left md:pb-4 md:border-b md:border-gray-200">
          <h2 
            className="font-bold text-center md:text-left text-base md:text-[24px] text-elegant md:col-span-1 md:leading-[38px]"
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
          <div 
            className="hidden md:block text-[24px] text-center"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              margin: 0,
              color: '#2C3E50'
            }}
          >
            В текущем состоянии
          </div>
          <div 
            className="hidden md:block font-semibold text-[30px] text-right"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              margin: 0,
              color: '#C95A1A'
            }}
          >
            от 15 000 тг/м²
          </div>
        </div>

        {/* Описание - по центру на мобильных */}
        <div className="flex flex-col md:grid md:grid-cols-3 items-start gap-4 md:gap-10 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p 
            className="text-center md:text-left text-xs md:text-[24px] w-full md:col-span-1 md:leading-[38px]"
            style={{ 
              lineHeight: '18px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              margin: 0,
              color: '#2C3E50',
            }}
          >
            Гибкие условия в зависимости от состояния и уровня оснащения офиса.
          </p>
          <div className="hidden md:flex md:flex-col gap-[54px] md:col-span-1">
            <div 
              className="text-[24px] rate-row"
              data-row="1"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50'
              }}
            >
              С мебелью, ремонтом
            </div>
            <div 
              className="text-[24px] rate-row"
              data-row="2"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50'
              }}
            >
              С мебелью, ремонтом и сервисом
            </div>
          </div>
          <div className="hidden md:flex md:flex-col gap-[54px] items-end md:col-span-1">
            <div 
              className="price-row-1 font-semibold text-[30px] text-right"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
                minWidth: 'fit-content'
              }}
            >
              от 18 000 тг/м²
            </div>
            <div 
              className="price-row-2 font-semibold text-[30px] text-right"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
                minWidth: 'fit-content'
              }}
            >
              от 25 000 тг/м²
            </div>
          </div>
        </div>

        {/* Мобильная версия - вертикальный список */}
        <div className="flex flex-col gap-3 md:hidden w-full">
          <div className="flex flex-row items-center justify-between w-full py-2 border-b border-gray-200">
            <div 
              className="text-sm transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
                fontSize: '14px'
              }}
            >
              В текущем состоянии
            </div>
            <div 
              className="font-semibold text-sm transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
                fontSize: '14px'
              }}
            >
              от 15 000 тг/м²
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full py-2 border-b border-gray-200">
            <div 
              className="text-sm transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
                fontSize: '14px'
              }}
            >
              С мебелью, ремонтом
            </div>
            <div 
              className="font-semibold text-sm transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
                fontSize: '14px'
              }}
            >
              от 18 000 тг/м²
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full py-2">
            <div 
              className="text-sm transition-all duration-300 flex-1 pr-2"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0,
                color: '#2C3E50',
                fontSize: '14px'
              }}
            >
              С мебелью, ремонтом и сервисом
            </div>
            <div 
              className="font-semibold text-sm transition-all duration-300 flex-shrink-0"
              style={{ 
                lineHeight: '20px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 600,
                margin: 0,
                color: '#C95A1A',
                fontSize: '14px'
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
