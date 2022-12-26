import { System } from '../system'

export default function resizeWith(
  system: System,
  element: Element,
  target: Element
): void {
  const {
    api: {
      document: { ResizeObserver },
    },
  } = system

  return resizeWithObserver(element, target, ResizeObserver)
}

export function resizeWithObserver(
  element: Element,
  target: Element,
  Observer: typeof ResizeObserver
): void {
  const { width, height } = target.getBoundingClientRect()

  element.setAttribute('width', `${width}`)
  element.setAttribute('height', `${height}`)

  const resizeObserver = new Observer((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      element.setAttribute('width', `${width}`)
      element.setAttribute('height', `${height}`)
    }
  })

  resizeObserver.observe(target)
}
