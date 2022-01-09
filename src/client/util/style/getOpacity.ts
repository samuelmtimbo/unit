import { IOElement } from '../../IOElement'

export function parseOpacity(opacity: string): number {
  return Number.parseFloat(opacity)
}

export function getOpacity(element: IOElement): number | undefined {
  if (element instanceof Text) {
    return
  }

  const { opacity } = element.style

  if (opacity) {
    return parseOpacity(opacity)
  }
}
