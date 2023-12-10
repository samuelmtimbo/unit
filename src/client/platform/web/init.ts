import { System } from '../../../system'
import { Unlisten } from '../../../types/Unlisten'
import { isSupportedKeyboardEvent } from '../../event/keyboard'
import { showNotification } from '../../showNotification'
import { COLOR_RED } from '../../theme'

export default function webInit(
  system: System,
  window: Window,
  root: HTMLElement
): Unlisten {
  const { document } = window

  const blurListener = () => {
    // TODO
    // when window is blurred by a popup/alert as a result
    // of a "keydown", "keyup" will not be fired
    system.input.keyboard.pressed = []
  }

  // double click is redefined in the system, so "whatever"
  // browser default behavior should be ignored
  const dbClickListener = (event: MouseEvent) => {
    event.preventDefault()
  }

  const keyDownListener = (event: KeyboardEvent) => {
    if (!isSupportedKeyboardEvent(event)) {
      return
    }

    const { metaKey, keyCode, key, repeat } = event

    // ignore all key events when meta key is pressed
    if (metaKey) {
      return
    }

    if (key === 'Tab') {
      event.preventDefault()
    }

    const index = system.input.keyboard.pressed.indexOf(keyCode)

    system.input.keyboard.repeat = repeat

    if (index === -1) {
      system.input.keyboard.pressed.push(keyCode)
    }
  }

  const keyUpListener = (event: KeyboardEvent) => {
    if (!isSupportedKeyboardEvent(event)) {
      return
    }

    const { metaKey, keyCode, key } = event

    if (metaKey) {
      return
    }

    const index = system.input.keyboard.pressed.indexOf(keyCode)

    system.input.keyboard.pressed.splice(index, 1)
  }

  // prevent app from reacting to 'wheel' event when
  // viewport is "pinch zoomed"
  const wheelListener = (event: MouseEvent) => {
    if (window.visualViewport) {
      const scale = window.visualViewport.scale || 1
      if (scale > 1) {
        event.stopPropagation()
      }
    }
  }

  // prevent document from scrolling at all (iPhone)
  const scrollListener = (event: Event) => {
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTop = 0

      event.preventDefault()
    }
  }

  // TODO
  const touchListener = (event: TouchEvent) => {
    const { touches } = event
    for (let i = 0; i < touches.length; i++) {
      const touch = touches.item(i)!
    }
  }

  const errorListener = (event: ErrorEvent) => {
    const { error } = event

    if (error) {
      // const message = `${error.message}\n\n${JSON.stringify(error.stack, null, 2)}`
      const message = `${error.message}`

      showNotification(system, message, {
        color: COLOR_RED,
        borderColor: COLOR_RED,
      })
    }
  }

  const dragOverListener = (event: DragEvent) => {
    event.preventDefault()
  }

  const dropListener = (event: DragEvent) => {
    event.preventDefault()
  }

  root.addEventListener('blur', blurListener, true)
  root.addEventListener('keydown', keyDownListener, true)
  root.addEventListener('keyup', keyUpListener, true)
  root.addEventListener('wheel', wheelListener, {
    capture: true,
    passive: true,
  })
  root.addEventListener('touchmove', touchListener)
  root.addEventListener('dblclick', dbClickListener)
  root.addEventListener('dragover', dragOverListener)
  root.addEventListener('drop', dropListener)

  window.addEventListener('error', errorListener)

  return () => {
    root.removeEventListener('blur', blurListener, true)
    root.removeEventListener('keydown', keyDownListener, true)
    root.removeEventListener('keyup', keyUpListener, true)
    root.removeEventListener('wheel', wheelListener, {
      capture: true,
    })
    root.removeEventListener('touchmove', touchListener)
    root.removeEventListener('dblclick', dbClickListener)
    root.removeEventListener('dragover', dragOverListener)
    root.removeEventListener('drop', dropListener)

    window.removeEventListener('error', errorListener)

    document.removeEventListener('scroll', scrollListener, { capture: true })
  }
}
