import { IOElement } from './IOElement'
import { Component } from './component'

export function isTextLike(leaf_comp: Component): boolean {
  const is_text =
    leaf_comp.$element instanceof Text || isContentEditable(leaf_comp.$element)

  return is_text
}

export function isContentEditable(element: IOElement): boolean {
  return (
    element instanceof HTMLDivElement &&
    element.getAttribute('contenteditable') === 'true'
  )
}
