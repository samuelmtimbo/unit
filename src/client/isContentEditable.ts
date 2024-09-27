import { IOElement } from './IOElement'

export function isContentEditable(element: IOElement): boolean {
  return (
    element instanceof HTMLDivElement &&
    element.getAttribute('contenteditable') === 'true'
  )
}
