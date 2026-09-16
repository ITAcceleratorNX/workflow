import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"

/** Знак и название без ссылки — для заставки, где кликать нечего. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center gap-3 text-ivory-50", className)}>
      <img
        src="/logo-white-40.webp"
        srcSet="/logo-white-40.webp 1x, /logo-white-80.webp 2x, /logo-white-120.webp 3x"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 object-contain"
      />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">
        TMK <span className="font-normal text-ivory-50/60">WorkFlow</span>
      </span>
    </span>
  )
}

interface LogoProps {
  className?: string
  onClick?: () => void
}

/** Знак и название для тёмных поверхностей: шапка, меню, подвал. */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link to="/" onClick={onClick} aria-label="TMK WorkFlow — главная" className={cn("flex shrink-0", className)}>
      <LogoLockup />
    </Link>
  )
}
