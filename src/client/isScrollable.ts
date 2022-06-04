const SCROLLABLE_OVERFLOW = ['auto', 'scroll']

export function hasScrollbar(): boolean {
  // TODO
  return true
}

export function isScrollable($element: HTMLElement): boolean {
  if ($element === null) {
    return false
  }

  const {
    style: { overflowY, overflowX },
  } = $element
  if (SCROLLABLE_OVERFLOW.includes(overflowY)) {
    const { clientHeight, scrollHeight } = $element
    if (scrollHeight > clientHeight) {
      return true
    } else {
      return isScrollable($element.parentElement)
    }
  } else if (SCROLLABLE_OVERFLOW.includes(overflowX)) {
    const { scrollWidth, clientWidth } = $element

    if (scrollWidth > clientWidth) {
      return true
    } else {
      return isScrollable($element.parentElement)
    }
  } else {
    return isScrollable($element.parentElement)
  }
}
