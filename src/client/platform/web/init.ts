import { System } from '../../../system'
import { Unlisten } from '../../../types/Unlisten'
import { addGlobalBlurListener } from '../../addGlobalBlurListener'
import { isSupportedKeyboardEvent } from '../../event/keyboard'

export default function init($system: System, $root: HTMLElement): Unlisten {
  addGlobalBlurListener($root, () => {
    // TODO
    // when window is blurred by a popup/alert as a result
    // of a "keydown", "keyup" will not be fired
    $system.input.keyboard.$pressed = []
  })

  // double click is redefined on the unit system
  // "whatever" browser default behavior should be ignored
  $root.ondblclick = (event: MouseEvent) => {
    event.preventDefault()
  }

  $root.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (!isSupportedKeyboardEvent(event)) {
        return
      }

      const { keyCode, repeat } = event

      const index = $system.input.keyboard.$pressed.indexOf(keyCode)
      $system.input.keyboard.$repeat = repeat
      if (index === -1) {
        $system.input.keyboard.$pressed.push(keyCode)
      }
    },
    true
  )

  $root.addEventListener(
    'keyup',
    (event: KeyboardEvent) => {
      if (!isSupportedKeyboardEvent(event)) {
        return
      }

      const { keyCode, key } = event

      const index = $system.input.keyboard.$pressed.indexOf(keyCode)
      $system.input.keyboard.$pressed.splice(index, 1)
    },
    true
  )

  // prevent app from reacting to 'wheel' event when
  // viewport is "pinch zoomed"
  $root.addEventListener(
    'wheel',
    (event: MouseEvent) => {
      if (window.visualViewport) {
        const scale = window.visualViewport.scale || 1
        if (scale > 1) {
          event.stopPropagation()
        }
      }
    },
    { capture: true, passive: true }
  )

  // $root.addEventListener('touchmove', (event: TouchEvent) => {
  //   const { touches } = event
  //   for (let i = 0; i < touches.length; i++) {
  //     const touch = touches.item(i)!
  //     log('touchmove', touch)
  //   }
  // })

  return () => {}
}
