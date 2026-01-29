import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { openWhatsApp, WHATSAPP_MESSAGES } from "../lib/constants"
import { User, Building2, Phone } from "lucide-react"

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    openWhatsApp(WHATSAPP_MESSAGES.form(formData.name, formData.company, formData.phone))
    
    // Очистка формы
    setFormData({ name: "", company: "", phone: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="w-full bg-white px-4 md:px-[120px] py-12 md:py-[60px]">
      <div 
        className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10 w-full max-w-[1200px] mx-auto p-[40px_20px] md:p-[60px]"
        style={{
          background: '#F7F8FA',
          borderRadius: '24px'
        }}
      >
        <h2 
          className="font-bold text-[#202124] tracking-[-2px] text-2xl md:text-4xl lg:text-[64px] w-full md:w-[520px]"
          style={{ 
            lineHeight: '64px',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700
          }}
        >
          Подберем офис, который подходит вашим задачам
        </h2>

        <div className="flex flex-col gap-6 md:gap-7 w-full md:w-[520px]">
          <p 
            className="text-[#555A65] text-sm md:text-base"
            style={{ 
              lineHeight: '22px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400
            }}
          >
            Заполните форму и команда Workflow свяжется с вами
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative w-full">
              <Input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                className="w-full pr-10 h-11 md:h-[44px] text-sm md:text-base"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D7DAE2',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  paddingRight: '40px',
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#000000'
                }}
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999EAD]" style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="relative w-full">
              <Input
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="Компания"
                className="w-full pr-10 h-11 md:h-[44px] text-sm md:text-base"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D7DAE2',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  paddingRight: '40px',
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#000000'
                }}
              />
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999EAD]" style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
              <div className="relative flex-1">
                <Input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  className="w-full pl-10 h-11 md:h-[44px] text-sm md:text-base"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D7DAE2',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    paddingLeft: '40px',
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#000000'
                  }}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999EAD]" style={{ width: '24px', height: '24px' }} />
              </div>
              <Button
                type="submit"
                className="flex items-center justify-center text-white font-bold h-11 md:h-[44px] text-sm md:text-[14px] w-full sm:w-[167px]"
                style={{
                  background: '#2055E5',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  gap: '12px',
                  lineHeight: '20px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700
                }}
              >
                Отправить заявку
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
