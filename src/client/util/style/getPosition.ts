import { IOElement } from '../../IOElement'
import { parseTransformXY } from '../../parseTransformXY'
import { addVector3, NULL_VECTOR, Position } from '../geometry'
import { getChildrenRect } from './getSize'

export function getPosition(element: IOElement): Position {
  if (element instanceof Text) {
    return { x: 0, y: 0 }
  } else {
    if (element.classList.contains('__parent')) {
      const { x, y } = getChildrenRect(element)

      return { x, y }
    } else {
      const { x, y } = element.getBoundingClientRect()

      return { x, y }
    }
  }
}

export function getRelativePosition(
  element: IOElement,
  relative: HTMLElement
): Position {
  if (element instanceof Text) {
    return getTextRelativePosition(element, relative)
  }

  if (element instanceof SVGElement) {
    return getSVGRelativePosition(element, relative)
  }

  if (element instanceof HTMLElement) {
    return getHTMLRelativePosition(element, relative)
  }
}

// RETURN
export function getTextRelativePosition(
  element: Text,
  relative: HTMLElement
): Position {
  const range = document.createRange()

  range.selectNodeContents(element)

  const rects = range.getClientRects()

  const rect = rects[0] || { x: 0, y: 0 }

  return rect
}

// RETURN
export function getSVGRelativePosition(
  element: SVGElement,
  relative: HTMLElement
): Position {
  // return NULL_VECTOR
  return element.parentElement
    ? getHTMLRelativePosition(element.parentElement, relative)
    : NULL_VECTOR
}

export function getHTMLRelativePosition(
  element: HTMLElement,
  relative: HTMLElement
): Position {
  const local_position = getLocalPosition(element)
  // const scroll_position = getScrollPosition(element, relative)
  const scroll_position = { x: 0, y: 0 }
  const parent_position = getParentPosition(element, relative)

  return addVector3(local_position, scroll_position, parent_position)
}

export function getParentPosition(
  element: HTMLElement,
  relative: HTMLElement
): Position {
  const { offsetParent } = element

  let x = 0
  let y = 0

  const pushParent = (p: HTMLElement) => {
    const local_position = getLocalPosition(p)

    x += local_position.x
    y += local_position.y
  }

  let p = offsetParent as HTMLElement
  while (p && p !== relative) {
    pushParent(p)
    p = p.offsetParent as HTMLElement
  }

  return { x, y }
}

export function getScrollPosition(
  element: HTMLElement,
  relative: HTMLElement
): Position {
  const { parentElement } = element

  let x = 0
  let y = 0

  const pushScrollParent = (p: HTMLElement) => {
    const { scrollLeft, scrollTop } = p

    x += scrollLeft
    y += scrollTop
  }

  let p = parentElement
  while (p && p !== relative) {
    pushScrollParent(p)
    p = p.parentElement
  }

  return { x, y }
}

export function getLocalPosition(element: HTMLElement): Position {
  const {
    offsetLeft = 0,
    offsetTop = 0,
    offsetWidth = 0,
    offsetHeight = 0,
    style,
  } = element

  let offset_x = offsetLeft
  let offset_y = offsetTop

  let width
  let height

  let transform_x
  let transform_y

  let scale_x
  let scale_y

  const { transform } = style

  if (width !== offsetWidth || height !== offsetHeight) {
    if (transform) {
      const [_transform_x, _transform_y, _scale_x, _scale_y] = parseTransformXY(
        transform,
        offsetWidth,
        offsetHeight
      )
      transform_x = _transform_x
      transform_y = _transform_y
      scale_x = _scale_x
      scale_y = _scale_y
    } else {
      transform_x = 0
      transform_y = 0
      scale_x = 1
      scale_y = 1
    }
  }

  width = offsetWidth
  height = offsetHeight

  // TODO there's more to it
  const x = offsetLeft + transform_x
  const y = offsetTop + transform_y

  return { x, y }
}
