import { cn } from "../../lib/utils"
import {
  BADGE_BASE,
  FALLBACK_BADGE,
  PROCESSING_STYLES,
  QUALITY_STYLES,
  STATUS_STYLES,
} from "./badgeStyles"
import type { LeadQuality, LeadStatus, ProcessingState } from "../types"

/**
 * Метка с цветом по справочнику. Значение вне справочника не ломает таблицу —
 * показывается нейтральным цветом, а не пропадает.
 */
function Badge({ value, styles }: { value: string | null; styles: Record<string, string> }) {
  if (!value) return <span className="text-ink-soft">—</span>
  return <span className={cn(BADGE_BASE, styles[value] ?? FALLBACK_BADGE)}>{value}</span>
}

export const StatusBadge = ({ value }: { value: LeadStatus | null }) => (
  <Badge value={value} styles={STATUS_STYLES} />
)

export const ProcessingBadge = ({ value }: { value: ProcessingState | null }) => (
  <Badge value={value} styles={PROCESSING_STYLES} />
)

export const QualityBadge = ({ value }: { value: LeadQuality | null }) => (
  <Badge value={value} styles={QUALITY_STYLES} />
)
