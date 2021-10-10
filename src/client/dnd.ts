import { System } from '../boot'
import NOOP from '../NOOP'
import { Unlisten } from '../Unlisten'
import { _addEventListener } from './event'

export function dragAndDrop(
  $system: System,
  element: HTMLElement | SVGElement,
  pointerId: number,
  x: number,
  y: number,
  width: number,
  height: number,
  data: any,
  onDrop: (foundTarget: boolean) => void = NOOP
): Unlisten {
  // console.log('dragAndDrop')
  const { $root } = $system

  const w = width / 2
  const h = height / 2

  element.style.left = `${x - w}px`
  element.style.top = `${y - h}px`

  $root.appendChild(element)

  $system.$flag.__DRAG__AND__DROP__[pointerId] = data

  let currentElement = document.elementFromPoint(x, y)

  if (currentElement) {
    // currentElement.dispatchEvent(
    //   new PointerEvent('pointercancel', { clientX: x, clientY: y, pointerId })
    // )
    // dispatchCustomEvent(currentElement, 'pointercancel', { clientX: x, clientY: y, pointerId }, true)
  }

  // $root.setPointerCapture(pointerId)

  $system.$flag.__POINTER__CAPTURE__[pointerId] = $root

  const findDropTarget = (clientX, clientY): Element | null => {
    let dropTarget = document.elementFromPoint(clientX, clientY)
    // @ts-ignore
    while (dropTarget && !dropTarget.__DROP__TARGET__) {
      dropTarget = dropTarget.parentElement
    }
    // @ts-ignore
    return dropTarget && dropTarget.__DROP__TARGET__ === true
      ? dropTarget
      : null
  }

  const pointerMoveListener = (event: PointerEvent) => {
    const { pointerId: _pointerId, clientX, clientY } = event
    // log('pointerMoveListener')
    if (_pointerId === pointerId) {
      element.style.left = `${clientX - w}px`
      element.style.top = `${clientY - h}px`

      const dropTarget = findDropTarget(clientX, clientY)

      if (dropTarget) {
        if (currentElement !== dropTarget) {
          if (currentElement) {
            // console.log('_dragleave', currentElement)
            currentElement.dispatchEvent(
              new CustomEvent('_dragleave', { detail: event, bubbles: true })
            )
          }
          currentElement = dropTarget
          // console.log('_dragenter', pointedElement)
          currentElement.dispatchEvent(
            new CustomEvent('_dragenter', { detail: event, bubbles: true })
          )
        } else {
          if (currentElement) {
            currentElement.dispatchEvent(
              new CustomEvent('_dragover', { detail: event, bubbles: true })
            )
          }
        }
      } else if (currentElement) {
        currentElement.dispatchEvent(
          new CustomEvent('_dragleave', { detail: event, bubbles: true })
        )
      }
      currentElement = dropTarget
    }
  }

  let canceled = false

  const cancel = () => {
    // console.log('__DRAG__AND__DROP__', 'pointerup')
    if (canceled) {
      return
    }

    canceled = true

    // $root.releasePointerCapture(pointerId)

    delete $system.$flag.__POINTER__CAPTURE__[pointerId]

    // setTimeout(() => {
    $root.removeChild(element)
    // }, 0)

    unlistenPointerMove()
    unlistenPointerUp()

    // $root.removeEventListener('pointermove', pointerMoveListener)
    // $root.removeEventListener('pointerup', pointerUpListener)
  }

  const pointerUpListener = (event: PointerEvent) => {
    const { pointerId: _pointerId, clientX, clientY } = event
    if (_pointerId === pointerId) {
      cancel()

      const dropTarget = findDropTarget(clientX, clientY)

      if (dropTarget) {
        dropTarget.dispatchEvent(
          new CustomEvent('_dragdrop', { detail: event, bubbles: true })
        )
        onDrop(true)
      } else {
        onDrop(false)
      }

      delete $system.$flag.__DRAG__AND__DROP__[pointerId]
    }
  }

  const unlistenPointerMove = _addEventListener(
    'pointermove',
    $root,
    pointerMoveListener,
    true
  )
  const unlistenPointerUp = _addEventListener(
    'pointerup',
    $root,
    pointerUpListener,
    true
  )

  // $root.addEventListener('pointermove', pointerMoveListener)
  // $root.addEventListener('pointerup', pointerUpListener)
  return cancel
}
