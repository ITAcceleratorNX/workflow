export function RatesSection() {
  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[100px]">
      <div className="flex flex-col gap-6 md:gap-7 w-full max-w-[1200px] mx-auto md:px-[80px]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 w-full md:justify-between">
          <h2 
            className="font-bold text-black text-lg md:text-[24px]"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              margin: 0
            }}
          >
            Тарифы аренды
          </h2>
          <div 
            className="text-black text-base md:text-[24px]"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              margin: 0
            }}
          >
            В текущем состоянии
          </div>
          <div 
            className="text-black font-normal text-lg md:text-[30px]"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              margin: 0
            }}
          >
            от 15 000 тг/м²
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 w-full md:justify-between">
          <div 
            className="text-black text-base md:text-[24px] w-full md:w-[312px]"
            style={{ 
              lineHeight: '38px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              margin: 0
            }}
          >
            Гибкие условия в зависимости от состояния и уровня оснащения офиса.
          </div>
          <div className="flex flex-col gap-4 md:gap-[54px] w-full md:w-[342px]">
            <div 
              className="text-black text-base md:text-[24px]"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0
              }}
            >
              С мебелью, ремонтом
            </div>
            <div 
              className="text-black text-base md:text-[24px]"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0
              }}
            >
              С мебелью, ремонтом и сервисом
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-[54px] w-full md:w-[235px] md:items-end">
            <div 
              className="text-black font-normal text-lg md:text-[30px]"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0
              }}
            >
              от 18 000 тг/м²
            </div>
            <div 
              className="text-black font-normal text-lg md:text-[30px]"
              style={{ 
                lineHeight: '38px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 400,
                margin: 0
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
