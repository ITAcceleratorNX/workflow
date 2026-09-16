import * as React from "react"
import { Link, type LinkProps } from "react-router-dom"
import type { VariantProps } from "class-variance-authority"
import { actionVariants } from "./actionVariants"
import { cn } from "../../lib/utils"

type ActionVariantProps = VariantProps<typeof actionVariants>

export interface ActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ActionVariantProps {}

/** Кнопка редизайна: действие на странице (открыть форму, меню). */
export const Action = React.forwardRef<HTMLButtonElement, ActionProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      type={type}
      className={cn(actionVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Action.displayName = "Action"

export interface ActionAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ActionVariantProps {}

/** Та же кнопка ссылкой: телефон, WhatsApp, внешние адреса. */
export const ActionAnchor = React.forwardRef<HTMLAnchorElement, ActionAnchorProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a className={cn(actionVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
ActionAnchor.displayName = "ActionAnchor"

export interface ActionLinkProps extends LinkProps, ActionVariantProps {}

/** Та же кнопка переходом внутри сайта - без перезагрузки страницы. */
export const ActionLink = React.forwardRef<HTMLAnchorElement, ActionLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Link
      className={cn(actionVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
ActionLink.displayName = "ActionLink"
