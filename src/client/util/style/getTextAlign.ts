import { IOElement } from '../../IOElement'

export function getTextAlign(element: IOElement): string {
  if (element instanceof Text) {
    return
  }

  const { textAlign } = element.style

  if (textAlign) {
    return textAlign
  }
}
