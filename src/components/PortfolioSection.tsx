import { useState } from "react"
import { Button } from "./ui/button"
import { officesData } from "../lib/officeData"
import { OfficeModal } from "./OfficeModal"
import {carouselData} from "@/lib/carouselData.ts";

export function PortfolioSection() {
  const [selectedOffice, setSelectedOffice] = useState<typeof officesData[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDetails = (officeId: number) => {
    const office = officesData.find(o => o.id === officeId)
    if (office) {
      // Убеждаемся, что office имеет все необходимые поля
      const officeWithDefaults = {
        ...office,
        images: office.images && Array.isArray(office.images) && office.images.length > 0 
          ? office.images 
          : office.mainImage 
            ? [{ src: office.mainImage, alt: office.name }]
            : [],
        mainImage: office.mainImage || '/og-image.webp',
        name: office.name || 'Офис',
        location: office.location || 'Алматы',
        address: office.address || '',
        cost: office.cost || 'по запросу',
        format: office.format || '',
        detailedInfo: office.detailedInfo || {}
      }
      setSelectedOffice(officeWithDefaults)
      setIsModalOpen(true)
    } else {
      console.error('Офис с ID', officeId, 'не найден')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOffice(null)
  }

  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[100px] animate-fade-in-up">
      <div className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-full md:max-w-[896px] animate-fade-in-up">
          <h2 
            className="font-bold text-center tracking-[-0.02em] text-xl md:text-3xl lg:text-[64px] leading-tight md:leading-[64px] text-elegant"
            style={{ 
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              color: '#1E3A5F'
            }}
          >
            ПОРТФЕЛЬ ОФИСНЫХ ПРОСТРАНСТВ
          </h2>
          <p 
            className="text-center text-sm md:text-base max-w-full md:max-w-[710px]"
            style={{ 
              fontSize: '16px',
              lineHeight: '22px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              color: '#2C3E50'
            }}
          >
            Наши пространства созданы для компаний, которым важны сервис, инфраструктура и рабочие решения, поддерживающие рост и эффективность.
          </p>
        </div>
          <div className="w-full overflow-hidden mt-6">
              <div className="flex gap-6 animate-scroll" style={{ ['--scroll-duration' as any]: '8s' }}>
                  {carouselData.images.map((image, index) => (
                      <div
                          key={index}
                          className="group/carousel min-w-[220px] h-[150px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-out"
                      >
                          <img
                              src={image.src}
                              alt={image.alt}
                              width={220}
                              height={150}
                              loading="lazy"
                              decoding="async"
                              fetchPriority={index < 3 ? 'high' : 'low'}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/carousel:scale-110"
                          />
                      </div>
                  ))}
              </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-[1200px]">
          {officesData.map((office) => (
            <div
              key={office.id}
              className="relative flex flex-col justify-end items-center rounded-[20px] md:rounded-[50px] overflow-hidden min-h-[250px] md:min-h-[300px] p-5 md:p-[35px_83px] card-hover stagger-item group"
            >
              {/* Background layer with smooth zoom on hover */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url(${office.mainImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 26.44%, rgba(255, 255, 255, 0.5) 92.79%)'
                }}
              />
              <div className="relative flex flex-col items-center gap-3 md:gap-[15px] w-full max-w-full md:max-w-[195px]">
                <Button
                  onClick={() => handleDetails(office.id)}
                  className="flex items-center justify-center bg-white font-normal text-xs md:text-sm lg:text-[13.9px] transition-all duration-300 ease-out hover:bg-[#C95A1A] hover:text-white hover:scale-105 hover:shadow-lg"
                  style={{
                    borderRadius: '50px',
                    padding: '11px 43px',
                    lineHeight: '19px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    color: '#2C3E50'
                  }}
                >
                    {office.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <OfficeModal
        office={selectedOffice}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}
