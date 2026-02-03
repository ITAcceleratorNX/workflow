import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Building2, Users, DollarSign, Star, MapPin, Square } from "lucide-react"
import type { OfficeDetails } from "../lib/officeData"
import { Button } from "./ui/button"

interface OfficeModalProps {
  office: OfficeDetails | null
  isOpen: boolean
  onClose: () => void
}

export function OfficeModal({ office, isOpen, onClose }: OfficeModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  // Определяем images до использования в хуках с безопасной проверкой
  const images = office && office.images && Array.isArray(office.images) && office.images.length > 0 
    ? office.images 
    : office && office.mainImage
      ? [{ src: office.mainImage, alt: office.name || 'Офис' }]
      : []

  useEffect(() => {
    if (isOpen && office) {
      document.body.style.overflow = "hidden"
      setCurrentImageIndex(0)
      setShowDetails(false)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, office])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Автопрокрутка карусели (должен быть до раннего возврата)
  useEffect(() => {
    if (!isOpen || !office || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000) // Меняем изображение каждые 3 секунды

    return () => clearInterval(interval)
  }, [isOpen, office, images.length])

  if (!isOpen || !office) return null

  // Безопасная проверка currentImage
  const currentImage = images.length > 0 && currentImageIndex < images.length 
    ? images[currentImageIndex] 
    : images.length > 0 
      ? images[0] 
      : null

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const handleShowDetails = () => {
    setShowDetails(!showDetails)
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-[24px] md:rounded-[32px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-all duration-200"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Карусель изображений */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 rounded-t-[24px] md:rounded-t-[32px] overflow-hidden">
          {currentImage ? (
            <>
              <img
                src={currentImage.src}
                alt={currentImage.alt || office.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback если изображение не загрузилось
                  const target = e.target as HTMLImageElement
                  target.src = office.mainImage || '/og-image.jpg'
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-all duration-200 z-10"
                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-all duration-200 z-10"
                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                  {/* Индикаторы */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span style={{ fontFamily: "'Open Sans', sans-serif" }}>Изображение не найдено</span>
            </div>
          )}
        </div>

        {/* Контент */}
        <div className="p-6 md:p-8">
          {/* Название */}
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              color: '#1E3A5F'
            }}
          >
            {office.name}
          </h2>

          {/* Основная информация */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {office.location} {office.address && `· ${office.address}`}
              </span>
            </div>
            {(office.class || office.year) && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {office.class && `Класс ${office.class}`}
                  {office.class && office.year && " / "}
                  {office.year && `Год постройки ${office.year}`}
                </span>
              </div>
            )}
            {office.rentableArea && (
              <div className="flex items-center gap-2 text-gray-700">
                <Square className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  Арендуемая площадь: {office.rentableArea}
                </span>
              </div>
            )}
            {office.totalBlockArea && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  {office.rentableArea ? 'Общая площадь блока' : 'Общая площадь здания'}: {office.totalBlockArea}
                </span>
              </div>
            )}
            {office.capacity && (
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  Вместимость: {office.capacity}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Стоимость: {office.cost}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-5 h-5 text-coral" style={{ color: '#C95A1A' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Формат: {office.format}
              </span>
            </div>
          </div>

          {/* Кнопка "Показать подробности" */}
          <Button
            onClick={handleShowDetails}
            className="w-full mb-6"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6B 100%)',
              borderRadius: '8px',
              padding: '12px 24px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 600,
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(30, 58, 95, 0.25)'
            }}
          >
            Показать подробности
          </Button>

          {/* Подробная информация (раскрывается при клике) */}
          {showDetails && office.detailedInfo && (
            <div className="space-y-6 pt-6 border-t border-gray-200">
              {office.detailedInfo.areaAndFormat && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Площадь и формат
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    {office.detailedInfo.areaAndFormat.rentableArea && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        Арендуемая площадь блока Work Flow: {office.detailedInfo.areaAndFormat.rentableArea}
                      </p>
                    )}
                    <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                      Формат аренды: {office.detailedInfo.areaAndFormat.format}
                    </p>
                  </div>
                </div>
              )}

              {office.detailedInfo.building && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Здание
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    {office.detailedInfo.building.class && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        Класс: {office.detailedInfo.building.class}
                      </p>
                    )}
                    {office.detailedInfo.building.year && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        Год постройки: {office.detailedInfo.building.year}
                      </p>
                    )}
                    {office.detailedInfo.building.totalArea && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        Общая площадь здания: {office.detailedInfo.building.totalArea}
                      </p>
                    )}
                    {office.detailedInfo.building.floors && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        Этажность: {office.detailedInfo.building.floors}
                      </p>
                    )}
                    {office.detailedInfo.building.location && (
                      <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {office.name === "Teniz Towers" ? "Локация" : "Адрес"}: {office.detailedInfo.building.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {office.detailedInfo.infrastructure && office.detailedInfo.infrastructure.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Инфраструктура внутри блока
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.infrastructure.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {office.detailedInfo.included && office.detailedInfo.included.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Что включено в ставку
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.included.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {office.detailedInfo.engineering && office.detailedInfo.engineering.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Инженерия
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.engineering.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {office.detailedInfo.parking && office.detailedInfo.parking.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Паркинг
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.parking.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {office.detailedInfo.environment && office.detailedInfo.environment.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    Окружение
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.environment.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {office.detailedInfo.usageScenario && office.detailedInfo.usageScenario.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 700,
                      color: '#1E3A5F'
                    }}
                  >
                    {office.name === "Teniz Towers" ? "Формат подходит под:" : "Сценарий использования"}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {office.detailedInfo.usageScenario.map((item, index) => (
                      <li key={index} style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
