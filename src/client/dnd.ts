import { NOOP } from '../NOOP'
import { System } from '../system'
import { Unlisten } from '../types/Unlisten'
import { _addEventListener } from './event'
import { IOElement } from './IOElement'

export function dragAndDrop(
  $system: System,
  element: IOElement,
  pointerId: number,
  x: number,
  y: number,
  width: number,
  height: number,
  data: any,
  onDrop: (foundTarget: boolean) => void = NOOP
): Unlisten {
  // console.log('dragAndDrop')
  const { root: $root } = $system

  const w = width / 2
  const h = height / 2

  // RETURN
  // @ts-ignore
  element.style.left = `${x - w}px`
  // @ts-ignore
  element.style.top = `${y - h}px`

  $root.appendChild(element)

  $system.cache.dragAndDrop[pointerId] = data

  let currentElement = document.elementFromPoint(x, y)

  if (currentElement) {
    // currentElement.dispatchEvent(
    //   new PointerEvent('pointercancel', { clientX: x, clientY: y, pointerId })
    // )
    // dispatchCustomEvent(currentElement, 'pointercancel', { clientX: x, clientY: y, pointerId }, true)
  }

  // $root.setPointerCapture(pointerId)

  $system.cache.pointerCapture[pointerId] = $root

  const findDropTarget = (clientX, clientY): Element | null => {
    let dropTarget = document.elementFromPoint(clientX, clientY)

    while (dropTarget && !dropTarget.hasAttribute('dropTarget')) {
      dropTarget = dropTarget.parentElement
    }

    return dropTarget && dropTarget.getAttribute('dropTarget') === 'true'
      ? dropTarget
      : null
  }

  const pointerMoveListener = (event: PointerEvent) => {
    const { pointerId: _pointerId, clientX, clientY } = event
    // log('pointerMoveListener')
    if (_pointerId === pointerId) {
      // @ts-ignore
      element.style.left = `${clientX - w}px`
      // @ts-ignore
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
    // console.log('dragAndDrop', 'pointerup')
    if (canceled) {
      return
    }

    canceled = true

    // $root.releasePointerCapture(pointerId)

    delete $system.cache.pointerCapture[pointerId]

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

      delete $system.cache.dragAndDrop[pointerId]
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
