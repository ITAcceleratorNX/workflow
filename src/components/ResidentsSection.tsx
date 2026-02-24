import { residentsData } from "@/lib/residentsData"
import { residentsCarouselImages } from "@/lib/residentsCarouselData"

export function ResidentsSection() {
  return (
      <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[100px]">
        <div className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-[1200px] mx-auto">

          {/* Заголовок */}
          <div className="flex flex-col items-center gap-6 md:gap-10 max-w-[896px]">
            <h2
                className="font-bold text-center tracking-[-0.02em] text-xl md:text-3xl lg:text-[64px]"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#1E3A5F",
                }}
            >
              НАШИ РЕЗИДЕНТЫ
            </h2>

            <p
                className="text-center text-sm md:text-base max-w-[710px]"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#2C3E50",
                }}
            >
              Нам доверяют ведущие компании, создающие инновации, развивающие
              бизнес и формирующие будущее.
            </p>
          </div>

          {/* Сетка логотипов (без карусели) */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center w-full">
              {residentsData.map((resident, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition w-full h-24"
                >
                  <img
                    src={resident.logo}
                    alt={resident.name}
                    width={160}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    fetchPriority={index < 6 ? 'high' : 'low'}
                    className="max-h-16 md:max-h-20 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Презентация Workflow App */}
          <div className="w-full flex flex-col items-center gap-6 md:gap-10">
            {/* Заголовок — как у основных секций */}
            <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
              <img
                src="/app-icon.webp"
                alt="Workflow App"
                loading="lazy"
                decoding="async"
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-[20px] shadow-lg"
              />
              <h3
                className="font-bold tracking-[-0.02em] text-xl md:text-3xl lg:text-[48px]"
                style={{ fontFamily: "'Open Sans', sans-serif", color: "#1E3A5F" }}
              >
                WORKFLOW APP
              </h3>
              <p
                className="text-sm md:text-base lg:text-lg max-w-[600px]"
                style={{ fontFamily: "'Open Sans', sans-serif", color: "#2C3E50" }}
              >
                Новое мобильное приложение для управления офисной инфраструктурой — всё в одном месте
              </p>
            </div>

            {/* Карусель — полноразмерные скриншоты */}
            <div className="w-full overflow-hidden">
              <div
                className="flex gap-6 md:gap-8 animate-scroll-infinite"
                style={{ ["--scroll-duration" as string]: "30s" }}
              >
                {[...residentsCarouselImages, ...residentsCarouselImages, ...residentsCarouselImages].map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[800px]"
                  >
                    <div className="relative aspect-[4/3] rounded-[20px] md:rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Возможности — компактные карточки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
              {[
                { title: "Бронирование", desc: "Переговорные комнаты и общие зоны в пару нажатий" },
                { title: "Заявки FM", desc: "Регистрация, отслеживание и контроль facility management" },
                { title: "Push-уведомления", desc: "Мгновенные оповещения о статусе заявок и бронирований" },
                { title: "Роли и доступ", desc: "Гибкая система прав для сотрудников и администраторов" },
                { title: "Аналитика", desc: "Дашборды, отчёты и ключевые KPI в реальном времени" },
                { title: "Все платформы", desc: "Единый интерфейс на Web, iOS и Android" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-md"
                  style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)" }}
                >
                  <p className="font-bold text-base md:text-lg mb-1" style={{ color: "#1E3A5F" }}>
                    {item.title}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "#2C3E50" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}