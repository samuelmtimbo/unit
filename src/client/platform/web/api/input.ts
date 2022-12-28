import { API, BootOpt } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { IPointer } from '../../../../types/global/IPointer'
import { Unlisten } from '../../../../types/Unlisten'

export const clonePointerEvent = (
  event: PointerEvent,
  partial: Partial<PointerEvent>
) => {
  const { pointerId, pointerType, clientX, clientY, screenX, screenY } = event

  return new PointerEvent(event.type, {
    pointerId,
    clientX,
    clientY,
    screenX,
    screenY,
    pointerType,
    ...partial,
  })
}

export function webInput(
  window: Window,
  root: HTMLElement,
  bootOpt: BootOpt
): API['input'] {
  const pointerCapture: Dict<HTMLElement | SVGElement> = {}
  const pointers: Dict<IPointer> = {}

  const pointerInListener = (event) => {
    const { pointerId, clientX, clientY } = event

    pointers[pointerId] = { screenX: clientX, screenY: clientY, down: false }
  }

  const pointerOutListener = (event) => {
    // console.log('pointerOutListener')

    const { pointerId } = event

    delete pointers[pointerId]
  }

  const pointerMoveListener = (event) => {
    const { pointerId, clientX, clientY } = event

    pointers[pointerId].screenX = clientX
    pointers[pointerId].screenY = clientY
  }

  const pointerDownListener = (event) => {
    const { pointerId } = event

    pointers[pointerId].down = true
  }

  const pointerUpListener = (event) => {
    const { pointerId } = event

    pointers[pointerId].down = false
  }

  const pointerCancelListener = (event) => {
    //
  }

  const opt = { capture: true }

  root.addEventListener('pointerover', pointerInListener, opt)
  root.addEventListener('pointerout', pointerOutListener, opt)
  root.addEventListener('pointermove', pointerMoveListener, opt)
  root.addEventListener('pointerdown', pointerDownListener, opt)
  root.addEventListener('pointerup', pointerUpListener, opt)
  root.addEventListener('pointercancel', pointerCancelListener, opt)

  const input = {
    keyboard: {},
    gamepad: {
      getGamepad: (i) => {
        const gamepads = navigator.getGamepads()
        const gamepad = gamepads[i]
        return gamepad
      },
      addEventListener: (
        type: 'gamepadconnected' | 'gamepaddisconnected',
        listener: (ev: GamepadEvent) => any,
        options?: boolean | AddEventListenerOptions
      ) => {
        window.addEventListener(type, listener, options)
        return () => {
          window.removeEventListener(type, listener, options)
        }
      },
    },
    pointer: {
      getPointerPosition: (
        pointerId: number
      ): { screenX: number; screenY: number } => {
        const pointer = pointers[pointerId]

        if (pointer) {
          return pointer
        } else {
          throw new Error('pointer cannot be found')
        }
      },
      setPointerCapture: (
        element: HTMLElement | SVGElement,
        pointerId: number
      ): Unlisten => {
        pointerCapture[pointerId] = element

        element.setPointerCapture(pointerId)

        return () => {
          element.releasePointerCapture(pointerId)

          delete pointerCapture[pointerId]
        }
      },
    },
  }

  return input
}
