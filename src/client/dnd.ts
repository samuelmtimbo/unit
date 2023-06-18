import { NOOP } from '../NOOP'
import { System } from '../system'
import { Unlisten } from '../types/Unlisten'
import { _addEventListener } from './event'
import { UnitPointerEvent } from './event/pointer'
import { IOElement } from './IOElement'

export type IODragAndDropEvent = UnitPointerEvent

export function startDragAndDrop<T = any>(
  system: System,
  element: IOElement,
  pointerId: number,
  data: T,
  onDrag: (screenX: number, screenY: number) => void,
  onDrop: (foundTarget: boolean, data?: T) => void = NOOP
): Unlisten {
  // console.log('dragAndDrop')

  const {
    root,
    api: {
      input: {
        pointer: { getPointerPosition },
      },
      document: { elementFromPoint },
    },
  } = system

  root.appendChild(element)

  system.cache.dragAndDrop[pointerId] = data

  const { screenX, screenY } = getPointerPosition(pointerId)

  let currentElement = elementFromPoint(screenX, screenY)

  if (currentElement) {
    currentElement.dispatchEvent(
      new CustomEvent('_dragenter', {
        detail: {
          pointerId,
          clientX: screenX,
          clientY: screenY,
          screenX,
          screenY,
        },
        bubbles: true,
      })
    )
  }

  const findDropTarget = (clientX, clientY): Element | null => {
    let dropTarget = elementFromPoint(clientX, clientY)

    return dropTarget

    while (dropTarget && !dropTarget.hasAttribute('dropTarget')) {
      dropTarget = dropTarget.parentElement
    }

    return dropTarget && dropTarget.getAttribute('dropTarget') === 'true'
      ? dropTarget
      : null
  }

  const drag = (screenX: number, screenY: number): void => {
    onDrag(screenX, screenY)

    const dropTarget = findDropTarget(screenX, screenY)

    if (dropTarget) {
      if (currentElement !== dropTarget) {
        if (currentElement) {
          // console.log('_dragleave', currentElement)
          currentElement.dispatchEvent(
            new CustomEvent('_dragleave', {
              detail: {
                pointerId,
                clientX: screenX,
                clientY: screenY,
                screenX,
                screenY,
              },
              bubbles: true,
            })
          )
        }

        currentElement = dropTarget

        currentElement.dispatchEvent(
          new CustomEvent('_dragenter', {
            detail: {
              pointerId,
              clientX: screenX,
              clientY: screenY,
              screenX,
              screenY,
            },
            bubbles: true,
          })
        )
      } else {
        if (currentElement) {
          currentElement.dispatchEvent(
            new CustomEvent('_dragover', {
              detail: {
                pointerId,
                clientX: screenX,
                clientY: screenY,
                screenX,
                screenY,
              },
              bubbles: true,
            })
          )
        }
      }
    } else if (currentElement) {
      currentElement.dispatchEvent(
        new CustomEvent('_dragleave', {
          detail: {
            pointerId,
            clientX: screenX,
            clientY: screenY,
            screenX,
            screenY,
          },
          bubbles: true,
        })
      )
    }
    currentElement = dropTarget
  }

  const pointerMoveListener = (event: PointerEvent) => {
    const { pointerId: _pointerId, clientX, clientY } = event
    // console.log('pointerMoveListener')

    if (_pointerId === pointerId) {
      drag(clientX, clientY)
    }
  }

  let canceled = false

  const _cancel = () => {
    // console.log('dragAndDrop', 'pointerup')
    if (canceled) {
      return
    }

    canceled = true

    root.removeChild(element)

    unlistenPointerMove()
    unlistenPointerUp()
  }

  const pointerUpListener = (event: PointerEvent) => {
    const { pointerId: _pointerId, clientX, clientY, ...rest } = event

    if (_pointerId === pointerId) {
      _cancel()

      const dropTarget = findDropTarget(clientX, clientY)

      if (dropTarget) {
        let dragBackData

        const dragBackListener = (event: CustomEvent<any>) => {
          dragBackData = event.detail
        }

        dropTarget.addEventListener('_dragback', dragBackListener, {
          capture: true,
        })

        dropTarget.dispatchEvent(
          new CustomEvent('_dragdrop', {
            detail: {
              ...{ pointerId: _pointerId, clientX, clientY, ...rest },
              data,
            },
            bubbles: true,
          })
        )

        dropTarget.removeEventListener('_dragback', dragBackListener, {
          capture: true,
        })

        onDrop(true, dragBackData)
      } else {
        onDrop(false, undefined)
      }

      delete system.cache.dragAndDrop[pointerId]
    }
  }

  const unlistenPointerMove = _addEventListener(
    'pointermove',
    root,
    pointerMoveListener,
    true
  )
  const unlistenPointerUp = _addEventListener(
    'pointerup',
    root,
    pointerUpListener,
    true
  )

  drag(screenX, screenY)

  return () => {
    if (currentElement) {
      currentElement.dispatchEvent(
        new CustomEvent('_dragcancel', {
          detail: { ...{ pointerId }, data },
          bubbles: true,
        })
      )
    }

    _cancel()
  }
}
