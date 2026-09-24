import { createContext, useContext } from "react"
import type { OpenWhatsAppGateOptions } from "./whatsappGate"

export interface WhatsAppGateContextValue {
  openWhatsAppGate: (options: OpenWhatsAppGateOptions) => void
  closeWhatsAppGate: () => void
}

export const WhatsAppGateContext = createContext<WhatsAppGateContextValue | null>(null)

export function useWhatsAppGate(): WhatsAppGateContextValue {
  const context = useContext(WhatsAppGateContext)
  if (!context) {
    throw new Error("useWhatsAppGate должен использоваться внутри <WhatsAppGateProvider>")
  }
  return context
}
