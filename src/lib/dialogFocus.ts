import { useEffect, type RefObject } from "react"

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]"
const scopes: object[] = []

/** Фокус и навигация читалки остаются внутри открытого диалога. */
export function useDialogFocus(
  rootRef: RefObject<HTMLElement | null>,
  active: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
  extraFocusRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const root = rootRef.current
    if (!active || !root) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const roots = [root, extraFocusRef?.current].filter((item): item is HTMLElement => Boolean(item))
    const scope = {}
    scopes.push(scope)
    const isCurrent = () => scopes.at(-1) === scope
    const contains = (node: Node | null) => roots.some((element) => element.contains(node))
    const focusable = () => roots.flatMap((element) => [
      ...(element.matches(FOCUSABLE) ? [element] : []),
      ...element.querySelectorAll<HTMLElement>(FOCUSABLE),
    ]).filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") &&
      !element.closest("[inert]") && element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== "hidden")
      .sort((left, right) => left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)

    const initialFocus = initialFocusRef?.current ?? root
    initialFocus.focus({ preventScroll: true })

    // Сохраняем исходный inert: другой диалог мог уже отключить фон.
    const disabled = new Map<HTMLElement, boolean>()
    const isolate = (parent: HTMLElement) => {
      for (const child of parent.children) {
        if (!(child instanceof HTMLElement) || roots.includes(child)) continue
        if (roots.some((element) => child.contains(element))) isolate(child)
        else {
          disabled.set(child, child.inert)
          child.inert = true
        }
      }
    }
    isolate(document.body)

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isCurrent() || event.key !== "Tab") return
      const controls = focusable()
      const first = controls[0]
      const last = controls.at(-1)
      const focused = document.activeElement
      if (!first || !last) {
        event.preventDefault()
        root.focus({ preventScroll: true })
      } else if (event.shiftKey && (focused === first || !controls.includes(focused as HTMLElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (focused === last || !contains(focused))) {
        event.preventDefault()
        first.focus()
      }
    }
    const onFocusIn = (event: FocusEvent) => {
      if (isCurrent() && !contains(event.target as Node)) {
        const target = focusable()[0] ?? root
        target.focus({ preventScroll: true })
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("focusin", onFocusIn)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("focusin", onFocusIn)
      scopes.splice(scopes.indexOf(scope), 1)
      disabled.forEach((inert, element) => { element.inert = inert })
      if (previousFocus?.isConnected && !previousFocus.closest("[inert]")) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [rootRef, active, initialFocusRef, extraFocusRef])
}
