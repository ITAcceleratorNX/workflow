import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        /* Оранжевый — основные действия (раздел 2 ТЗ) */
        primary:
          "bg-orange-500 text-white shadow-[0_8px_20px_-8px_rgba(242,107,33,0.7)] hover:bg-orange-600 hover:shadow-[0_12px_26px_-8px_rgba(242,107,33,0.75)] active:translate-y-px",
        secondary: "bg-brand-900 text-white hover:bg-brand-800 active:translate-y-px",
        outline:
          "border border-brand-200 bg-white text-brand-900 hover:border-brand-400 hover:bg-brand-50 active:translate-y-px",
        ghost: "text-brand-800 hover:bg-brand-50",
        link: "text-brand-700 underline-offset-4 hover:text-orange-600 hover:underline",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)
