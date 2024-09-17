import { Component } from './component'
import { isContentEditable } from './isContentEditable'

export function isTextLike(leaf_comp: Component): boolean {
  return isText(leaf_comp.$element)
}

export function isText(element): boolean {
  const is_text = element instanceof Text || isContentEditable(element)

  return is_text
}
