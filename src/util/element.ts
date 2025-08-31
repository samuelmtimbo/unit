import { IOElement } from '../client/IOElement'
import { isTextField } from '../client/isTextField'
import { System } from '../system'
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

export type Tag = {
  name: string
  attr: Dict<string>
  children: Tag[]
  textContent?: string
}

export function elementToJson(element: HTMLElement): Tag {
  if (element instanceof Text) {
    return {
      name: '_text',
      attr: {
        value: element.textContent,
      },
      children: [],
    }
  }

  const attr = Object.fromEntries(
    [...element.attributes].map((attr) => [attr.name, attr.value])
  )

  const children = [...element.childNodes]
    .filter((node) => !(node instanceof Text) || !!node.textContent.trim())
    .map(elementToJson)

  const name = element.tagName.toLowerCase()

  return {
    name,
    attr,
    children,
  }
}

export function isElementFocusable(system: System, element: Element): boolean {
  const {
    api: {
      window: { HTMLElement, getComputedStyle },
    },
  } = system

  if (!(element instanceof HTMLElement)) {
    return false
  }

  const tabIndex = element.getAttribute('tabindex')
  const hasTabIndex = tabIndex !== null

  const style = getComputedStyle(element)

  if (style.visibility === 'hidden' || style.display === 'none') {
    return false
  }

  if ('disabled' in element && element.disabled) {
    return false
  }

  if (isTextField(element)) {
    return true
  }

  if (hasTabIndex && parseInt(tabIndex, 10) >= 0) {
    return true
  }

  return false
}
