import { IOElement } from '../client/IOElement'

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
