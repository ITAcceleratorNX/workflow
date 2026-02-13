import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { CheckCircle2 } from "lucide-react"

export function ThankYouPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center text-center max-w-[520px] w-full p-[40px_20px] md:p-[60px] animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(30, 58, 95, 0.08), 0 0 0 1px rgba(201, 90, 26, 0.05)',
        }}
      >
        <div
          className="flex items-center justify-center w-[80px] h-[80px] rounded-full mb-6"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6B 100%)',
          }}
        >
          <CheckCircle2 className="text-white" style={{ width: '40px', height: '40px' }} />
        </div>

        <h1
          className="font-bold tracking-[-1px] text-2xl md:text-4xl mb-4"
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            color: '#1E3A5F',
            lineHeight: '1.2',
          }}
        >
          Спасибо за заявку!
        </h1>

        <p
          className="text-sm md:text-base mb-8"
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 400,
            color: '#2C3E50',
            lineHeight: '24px',
          }}
        >
          Мы получили вашу заявку и свяжемся с вами в ближайшее время. 
          Наша команда подберет идеальный офис для вашего бизнеса.
        </p>

        <Button
          onClick={() => navigate('/')}
          className="flex items-center justify-center text-white font-bold h-11 md:h-[44px] text-sm md:text-[14px] px-8 btn-animate relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6B 100%)',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.25)',
          }}
        >
          <span className="relative z-10">
            Вернуться на главную
          </span>
        </Button>
      </div>
    </div>
  )
}
