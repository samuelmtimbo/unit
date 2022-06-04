import { MODE_TO_KEY } from '../../../system/platform/component/app/Editor/Component'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../types/Unlisten'
import { Component } from '../../component'
import {
  IOKeyboardEvent,
  isKeyPressed,
  makeShortcutListener,
  Shortcut,
} from '../../event/keyboard'
import { Mode } from '../../mode'
import { KEY_TO_MODE } from '../constant/KEY_TO_MODE'

export const enableModeKeyboard = (
  component: Component,
  callback: (mode: string) => void
): Unlisten => {
  const { $system } = component
  // console.log('enableModeKeyboard')
  const _mode_keydown: Dict<boolean> = {}

  const shortcuts: Shortcut[] = []

  for (const mode in MODE_TO_KEY) {
    const mode_key = MODE_TO_KEY[mode]

    if (isKeyPressed($system, mode_key)) {
      _mode_keydown[mode_key] = true

      callback(mode as Mode)
    }

    shortcuts.push({
      combo: mode_key,
      strict: false,
      keydown: (key: string, event: IOKeyboardEvent) => {
        const { ctrlKey } = event

        if (ctrlKey) {
          return
        }

        // console.log('keydown', key)
        if (mode_key === key) {
          _mode_keydown[key] = true

          callback(mode as Mode)
        }
      },
      keyup: (key: string) => {
        // console.log('keyup', key)
        // AD HOC
        // this might come from a "focusout" event,
        // resultant of search being shown
        // setTimeout(() => {
        delete _mode_keydown[key]

        if (key === MODE_TO_KEY[mode]) {
          const mode_keydown = Object.keys(_mode_keydown)

          const mode_keydown_count = mode_keydown.length

          if (mode_keydown_count > 0) {
            callback(KEY_TO_MODE[mode_keydown[mode_keydown_count - 1]] as Mode)
          } else {
            callback('none')
          }
        }
        // }, 0)
      },
    })
  }

  const shortcutListener = makeShortcutListener(shortcuts)

  const keyboard_unlisten = component.addEventListener(shortcutListener)

  return keyboard_unlisten
}
