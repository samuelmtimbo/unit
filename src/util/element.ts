import { IOElement } from '../client/IOElement'
import { Dict } from '../types/Dict'

export function appendChild<T extends Node>(node: Node, newChild: T): T {
  return node.appendChild(newChild)
}

export function insertBefore<T extends Node>(
  node: Node,
  newChild: T,
  refChild: Node | null
): T {
  return node.insertBefore(newChild, refChild)
}

export function insertBeforeAt<T extends Node>(
  node: Node,
  newChild: T,
  at: number
): T {
  const nextChild = node.childNodes.item(at)

  return insertBefore(node, newChild, nextChild)
}

export function removeChild<T extends Node>(node: Node, oldChild: T): T {
  return node.removeChild(oldChild)
}

export function prepend<T extends IOElement>(
  node: IOElement,
  newChild: T
): void {
  if (node instanceof Text) {
    return
  }

  return node.prepend(newChild)
}

export function removeChildren(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild)
  }
}

export function insertAt(node: Node, newChild: Node, at: number) {
  const currentChild = node.childNodes.item(at)

  if (currentChild) {
    return insertBefore(node, newChild, currentChild)
  } else {
    return appendChild(node, newChild)
  }
}

export type Tag = { tag: string; attr: Dict<string>; children: Tag[] }

export function elementToJson(element: HTMLElement): Tag {
  return {
    tag: element.tagName,
    attr: Object.fromEntries(
      [...element.attributes].map((attr) => [attr.name, attr.value])
    ),
    children: [...element.children].map(elementToJson),
  }
}
