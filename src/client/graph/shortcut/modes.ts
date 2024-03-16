import { keys } from '../../../system/f/object/Keys/f'
import { MODE_TO_KEY } from '../../../system/platform/component/app/Editor/MODE_TO_KEY'
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
      multiple: false,
      keydown: (key: string, event: IOKeyboardEvent) => {
        const { ctrlKey } = event

        if (ctrlKey) {
          return
        }

        if (mode_key === key) {
          _mode_keydown[key] = true

          callback(mode as Mode)
        }
      },
      keyup: (key: string) => {
        delete _mode_keydown[key]

        if (key === MODE_TO_KEY[mode]) {
          const mode_keydown = keys(_mode_keydown)

          const mode_keydown_count = mode_keydown.length

          if (mode_keydown_count > 0) {
            callback(KEY_TO_MODE[mode_keydown[mode_keydown_count - 1]] as Mode)
          } else {
            callback('none')
          }
        }
      },
    })
  }

  const shortcutListener = makeShortcutListener(shortcuts)

  const keyboard_unlisten = component.addEventListener(shortcutListener)

  return keyboard_unlisten
}
