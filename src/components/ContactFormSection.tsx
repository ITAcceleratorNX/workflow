import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { User, Building2, Phone } from "lucide-react"

// Функция форматирования номера телефона в казахстанском формате: +7 (XXX) XXX-XX-XX
const formatPhoneNumber = (value: string): string => {
  // Удаляем все нецифровые символы
  const numbers = value.replace(/\D/g, '')

  // Если номер начинается с 8, заменяем на 7
  let formatted = numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers
  
  // Если номер не начинается с 7, добавляем 7
  if (formatted && !formatted.startsWith('7')) {
    formatted = '7' + formatted
  }
    // Ограничиваем до 11 цифр (7 + 10 цифр)
  formatted = formatted.slice(0, 11)

  // Форматируем: +7 (XXX) XXX-XX-XX
  if (formatted.length === 0) return ''
  if (formatted.length <= 1) return `+${formatted}`
  if (formatted.length <= 4) return `+${formatted.slice(0, 1)} (${formatted.slice(1)}`
  if (formatted.length <= 7) return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4)}`
  if (formatted.length <= 9) return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`
  return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`
}

export function ContactFormSection() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Переход на страницу благодарности
    navigate('/thank-you')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      // Форматируем номер телефона
      const formatted = formatPhoneNumber(value)
      setFormData({
        ...formData,
        [name]: formatted,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[60px] animate-fade-in-up">
      <div 
        className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10 w-full max-w-[1200px] mx-auto p-[40px_20px] md:p-[60px] animate-scale-in glass-effect"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(30, 58, 95, 0.08), 0 0 0 1px rgba(201, 90, 26, 0.05)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <h2 
          className="font-bold tracking-[-2px] text-2xl md:text-4xl lg:text-[64px] w-full md:w-[520px] animate-slide-in-left text-elegant"
          style={{ 
            lineHeight: '1.2',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            color: '#1E3A5F'
          }}
        >
          Подберем офис, который подходит вашим задачам
        </h2>

        <div className="flex flex-col gap-6 md:gap-7 w-full md:w-[520px] animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <p 
            className="text-sm md:text-base"
            style={{ 
              lineHeight: '22px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              color: '#2C3E50'
            }}
          >
            Заполните форму и команда Work Flow свяжется с вами
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative w-full group">
              <Input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                className="w-full pr-10 h-11 md:h-[44px] text-sm md:text-base transition-all duration-300"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D7DAE2',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  paddingRight: '40px',
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#2C3E50'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C95A1A'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201, 90, 26, 0.2)'
                  const icon = e.currentTarget.parentElement?.querySelector('svg')
                  if (icon) icon.style.color = '#C95A1A'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#D7DAE2'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.parentElement?.querySelector('svg')
                  if (icon) icon.style.color = '#999EAD'
                }}
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999EAD] transition-all duration-300" style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="relative w-full group">
              <Input
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="Компания"
                className="w-full pr-10 h-11 md:h-[44px] text-sm md:text-base transition-all duration-300"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D7DAE2',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  paddingRight: '40px',
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#2C3E50'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C95A1A'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201, 90, 26, 0.2)'
                  const icon = e.currentTarget.parentElement?.querySelector('svg')
                  if (icon) icon.style.color = '#C95A1A'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#D7DAE2'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.parentElement?.querySelector('svg')
                  if (icon) icon.style.color = '#999EAD'
                }}
              />
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999EAD] transition-all duration-300" style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
              <div className="relative flex-1 group">
                <Input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  maxLength={18}
                  className="w-full pl-10 h-11 md:h-[44px] text-sm md:text-base transition-all duration-300"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D7DAE2',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    paddingLeft: '40px',
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#2C3E50'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C95A1A'
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201, 90, 26, 0.2)'
                    const icon = e.currentTarget.parentElement?.querySelector('svg')
                    if (icon) icon.style.color = '#C95A1A'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D7DAE2'
                    e.currentTarget.style.boxShadow = 'none'
                    const icon = e.currentTarget.parentElement?.querySelector('svg')
                    if (icon) icon.style.color = '#999EAD'
                  }}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999EAD] transition-all duration-300" style={{ width: '24px', height: '24px' }} />
              </div>
              <Button
                type="submit"
                className="flex items-center justify-center text-white font-bold h-11 md:h-[44px] text-sm md:text-[14px] w-full sm:w-[167px] btn-animate relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6B 100%)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  gap: '12px',
                  lineHeight: '20px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(30, 58, 95, 0.25)'
                }}
              >
                <span className="relative z-10">
                  Отправить заявку
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
