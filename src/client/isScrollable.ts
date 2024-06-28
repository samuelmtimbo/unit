import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'

const SCROLLABLE_OVERFLOW = ['auto', 'scroll']

export function hasScrollbar(): boolean {
  throw new MethodNotImplementedError()
}

export function isScrollableChild(
  element: HTMLElement,
  parentElement: HTMLElement
): boolean {
  return true
}

export function isScrollable(element: HTMLElement): boolean {
  if (element === null) {
    return false
  }

  const {
    style: { overflowY, overflowX },
  } = element

  const isParentScrollable = () => {
    const { parentElement } = element

    if (parentElement) {
      return (
        isScrollableChild(element, parentElement) && isScrollable(parentElement)
      )
    } else {
      return false
    }
  }

  if (SCROLLABLE_OVERFLOW.includes(overflowY)) {
    const { clientHeight, scrollHeight } = element

    if (scrollHeight > clientHeight) {
      return true
    } else {
      return isParentScrollable()
    }
  } else if (SCROLLABLE_OVERFLOW.includes(overflowX)) {
    const { scrollWidth, clientWidth } = element

    if (scrollWidth > clientWidth) {
      return true
    } else {
      return isParentScrollable()
    }
  } else {
    return isParentScrollable()
  }
}
