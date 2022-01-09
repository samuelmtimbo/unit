import { IOElement } from '../../IOElement'

export function parseFontSize(fontSize: string): number {
  return Number.parseFloat(fontSize.substring(0, fontSize.length - 2))
}

export function getFontSize(element: IOElement): number | undefined {
  if (element instanceof Text) {
    return
  }

  const { fontSize } = element.style
  if (fontSize) {
    return parseFontSize(fontSize)
  }
}
