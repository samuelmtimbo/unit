import { System } from '../../../system'
import isEqual from '../../../system/f/comparisson/Equals/f'
import { keys } from '../../../system/f/object/Keys/f'
import { Dict } from '../../../types/Dict'
import { randomIdNotIn } from '../../../util/id'
import { addGlobalBlurListener } from '../../addGlobalBlurListener'
import { IOElement } from '../../IOElement'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { keyCodeToKey, keyToKeyCode } from './keyCode'

export function sameSetArray(a: string[], b: string[]): boolean {
  const _ = (a: string, b: string) => {
    return a.localeCompare(b)
  }
  return isEqual(a.sort(_), b.sort(_))
}

export function getKey(keyCode: number): string {
  return keyCodeToKey[keyCode]
}

export function isSupportedKeyboardEvent(event: KeyboardEvent): boolean {
  const { key, metaKey } = event

  // if (metaKey) {
  //   return false
  // }

  if (key === 'imeprocess') {
    return false
  }

  if (key === 'CapsLock') {
    return false
  }

  return true
}

export type Shortcut = {
  combo: string | string[]
  multiple?: boolean
  strict?: boolean
  keydown?: (key: string, event: IOKeyboardEvent) => boolean | void
  keyup?: (key: string, event: IOKeyboardEvent) => boolean | void
  preventDefault?: boolean
}

export default class KeyboardController {
  public static keys = keyCodeToKey

  private _ctrl: boolean = false
  private _meta: boolean = false
  private _shift: boolean = false
  private _alt: boolean = false
  private _repeat: boolean = false
  private _pressed: number[] = []
  private _shortcuts: { [id: string]: Shortcut[] }

  public $element: IOElement
  public $system: System

  constructor($system: System, $element: IOElement) {
    this.$system = $system
    this.$element = $element

    this._ctrl = false
    this._meta = false
    this._shift = false
    this._alt = false
    this._pressed = []
    this._shortcuts = {}

    const { root: $root } = $system

    addGlobalBlurListener($root, () => {
      this._flush()
    })

    this._reset()
  }

  private _listen = () => {
    this.$element.addEventListener('keydown', this._onKeydown)
    this.$element.addEventListener('keyup', this._onKeyup)
    this.$element.addEventListener('focusin', this._onFocusIn)
    this.$element.addEventListener('focusout', this._onFocusOut)
  }

  private _unlisten = () => {
    // console.log('KeyboardController', '_unlisten')
    this.$element.removeEventListener('keydown', this._onKeydown)
    this.$element.removeEventListener('keyup', this._onKeyup)
    this.$element.removeEventListener('focusin', this._onFocusIn)
    this.$element.removeEventListener('focusout', this._onFocusOut)
  }

  private _reset = () => {
    const { $system } = this

    const { input: $input } = $system

    const { keyboard: $keyboard } = $input

    const { pressed: $pressed } = $keyboard

    // AD HOC
    this._repeat = false

    // for (const keyCode of pressed) {
    //   this._keydown(keyCode)
    // }
    this._pressed = [...$pressed]
  }

  private _onFocusIn = () => {
    // console.log('KeyboardController', '_onFocusIn')
    this._reset()
  }

  private _onFocusOut = () => {
    // console.log('KeyboardController', '_onFocusOut')
    // this._flush()
  }

  public isCtrlPressed() {
    return this._ctrl
  }

  public isAltPressed() {
    return this._alt
  }

  public isShiftPressed() {
    return this._shift
  }

  private _removeEmptySpace(shortcut: Shortcut): Shortcut {
    if (shortcut.combo) {
      if (Array.isArray(shortcut.combo)) {
        shortcut.combo = shortcut.combo.map((c) => c.replace(/ /g, ''))
      } else {
        shortcut.combo = shortcut.combo.replace(/ /g, '')
      }
    }
    return shortcut
  }

  public addShortcutGroup(shortcutGroup: Shortcut[]): string {
    const id = randomIdNotIn(this._shortcuts)
    this._shortcuts[id] = shortcutGroup.map(this._removeEmptySpace)
    if (keys(this._shortcuts).length === 1) {
      this._listen()
    }
    return id
  }

  public removeShortcutGroup(id: string): void {
    delete this._shortcuts[id]
    if (keys(this._shortcuts).length === 0) {
      this._unlisten()
    }
  }

  public isKeyPressed(key: string): boolean {
    const keyCode = keyToKeyCode[key]
    return !!keyCode && this._pressed.indexOf(keyCode) > -1
  }

  private _flush = (): void => {
    ;[...this._pressed].forEach((p) => this._keyup(p))
  }

  private _filterShortcuts(type: 'keydown' | 'keyup'): Shortcut[] {
    const filtered: Shortcut[] = []
    for (const id in this._shortcuts) {
      const shortcutGroup = this._shortcuts[id]
      const currentCombo = this.getCurrentCombo()
      const currentComboStr = currentCombo.join('+')
      for (const shortcut of shortcutGroup) {
        let match = false
        if (
          (type === 'keydown' && shortcut.keydown) ||
          (type === 'keyup' && shortcut.keyup)
        ) {
          let { combo } = shortcut
          const { strict } = shortcut
          combo = Array.isArray(combo) ? combo : [combo]
          for (const c of combo) {
            if (
              c === currentComboStr ||
              (strict === false && currentCombo.includes(c))
            ) {
              match = true
              break
            }
          }
        }
        if (match) {
          filtered.push(shortcut)
        }
      }
    }
    return filtered
  }

  private _remove(keyCode: number): void {
    const index: number = this._pressed.indexOf(keyCode)
    if (index > -1) {
      this._pressed.splice(index, 1)
    }
  }

  private _keydown = (keyCode: number): Shortcut[] => {
    const index: number = this._pressed.indexOf(keyCode)
    // const previous = this.getCurrentCombo()
    if (index === -1) {
      this._pressed.push(keyCode)
    }
    // const current = this.getCurrentCombo()
    // console.log('_keydown', `${previous} -> ${current}`)
    const filtered = this._filterShortcuts('keydown')
    for (const shortcut of filtered) {
      if (this._repeat && !shortcut.multiple) {
        continue
      }
      const key = keyCodeToKey[keyCode]
      shortcut.keydown(key, {
        key,
        keyCode,
        ctrlKey: this._ctrl,
        shiftKey: this._shift,
        altKey: this._alt,
        metaKey: this._meta,
        repeat: this._repeat,
      })
    }
    // if (sameSetArray(current, ['meta', 'alt', 'i'])) {
    //   this._flush()
    // }
    return filtered
  }

  private _keyup = (keyCode: number) => {
    const index: number = this._pressed.indexOf(keyCode)
    if (index > -1) {
      const filtered = this._filterShortcuts('keyup')
      // const previous = this.getCurrentCombo()
      this._remove(keyCode)
      // const current = this.getCurrentCombo()
      // console.log('_keyup', `${previous} -> ${current}`)
      const key = keyCodeToKey[keyCode]
      for (const shortcut of filtered) {
        shortcut.keyup(key, {
          key,
          keyCode,
          ctrlKey: this._ctrl,
          shiftKey: this._shift,
          altKey: this._alt,
          metaKey: this._meta,
          repeat: this._repeat,
        })
      }
    }
  }

  private _isSystemCombo(event: KeyboardEvent): boolean {
    const { key, ctrlKey, metaKey } = event

    if ((metaKey || ctrlKey) && ['c', 'v', 'x', 'z'].includes(key)) {
      return true
    }

    return false
  }

  private _onKeydown = (event: KeyboardEvent): void => {
    const {} = this.$system

    const { keyCode, key, ctrlKey, shiftKey, metaKey, altKey, repeat } = event

    if (metaKey) {
      // event.preventDefault()

      return
    }

    if (!isSupportedKeyboardEvent(event)) {
      event.preventDefault()

      return
    }

    this._ctrl = ctrlKey
    this._meta = metaKey
    this._shift = shiftKey
    this._alt = altKey
    this._repeat = repeat

    const shortcuts = this._keydown(keyCode)

    for (const shortcut of shortcuts) {
      if (shortcut && shortcut.preventDefault) {
        event.preventDefault()
      }
    }
  }

  public getCurrentCombo(): string[] {
    return this._pressed.map((c) => {
      const key: string = keyCodeToKey[c]
      return key
    })
  }

  private _comboToKeyCodes(combo: string): (number | null)[] {
    return combo.split('+').map((key) => keyToKeyCode[key])
  }

  private _onKeyup = (event: KeyboardEvent): void => {
    // console.log('KeyboardController', '_onKeyup')
    if (!isSupportedKeyboardEvent(event)) {
      return
    }

    const { keyCode, key, ctrlKey, shiftKey, metaKey, altKey } = event

    this._ctrl = ctrlKey
    this._meta = metaKey
    this._shift = shiftKey
    this._alt = altKey

    this._keyup(keyCode)

    // if (this._pressed.length > 0) {
    //   this._keydown(this._pressed[this._pressed.length - 1])
    // }

    // meta/alt key prevents other keys from firing up
    // if (key === 'meta') {
    //   this._flush()
    // }
  }
}

export function makeShortcutListener(
  shortcuts: Shortcut[],
  _global: boolean = false
): Listener {
  return (component) => {
    return listenShortcut(component, shortcuts, _global)
  }
}

export function listenShortcut(
  component: Listenable,
  shortcuts: Shortcut[],
  _global: boolean = false
): () => void {
  const { $element, $system } = component
  const $keyboard = new KeyboardController($system, $element)
  const shortcutGroupId = $keyboard.addShortcutGroup(shortcuts)
  return () => {
    $keyboard.removeShortcutGroup(shortcutGroupId)
  }
}

export interface IOKeyboardEvent {
  key: string
  keyCode: number
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  repeat: boolean
}

export function listenKeydown(
  component: Listenable,
  onKeydown: (event: IOKeyboardEvent, _event: KeyboardEvent) => void
) {
  const { $element } = component
  const keydownListener = (_event: KeyboardEvent) => {
    const { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat } = _event
    onKeydown &&
      onKeydown(
        { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat },
        _event
      )
  }
  $element.addEventListener('keydown', keydownListener)
  return () => {
    $element.removeEventListener('keydown', keydownListener)
  }
}

export function listenKeypress(
  component: Listenable,
  onKeydown: (event: IOKeyboardEvent, _event: KeyboardEvent) => void
) {
  const { $element } = component
  const keypressListener = (_event: KeyboardEvent) => {
    const { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat } = _event
    onKeydown &&
      onKeydown(
        { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat },
        _event
      )
  }
  $element.addEventListener('keypress', keypressListener)
  return () => {
    $element.removeEventListener('keypress', keypressListener)
  }
}

export function makeKeydownListener(
  listener: (data: IOKeyboardEvent, _event: KeyboardEvent) => void
): Listener {
  return (component) => {
    return listenKeydown(component, listener)
  }
}

export function makeKeypressListener(
  listener: (data: IOKeyboardEvent, _event: KeyboardEvent) => void
): Listener {
  return (component) => {
    return listenKeypress(component, listener)
  }
}

export function listenKeyup(
  component: Listenable,
  onKeyup: (event: IOKeyboardEvent, _event: KeyboardEvent) => void
) {
  const { $element } = component
  const keyupListener = (_event: KeyboardEvent) => {
    const { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat } = _event
    onKeyup &&
      onKeyup(
        { key, keyCode, ctrlKey, shiftKey, altKey, metaKey, repeat },
        _event
      )
  }
  $element.addEventListener('keyup', keyupListener)
  return () => {
    $element.removeEventListener('keyup', keyupListener)
  }
}

export function makeKeyupListener(
  listener: (data: IOKeyboardEvent) => void
): Listener {
  return (component) => {
    return listenKeyup(component, listener)
  }
}

const codeToKey: Dict<[string, string, string, string]> = {
  Backquote: ['`', '~', '`', '`'],
  Digit1: ['1', '!', '¡', '⁄'],
  Digit2: ['2', '@', '™', '€'],
  Digit3: ['3', '#', '£', '‹'],
  Digit4: ['4', '$', '¢', '›'],
  Digit5: ['5', '%', '∞', 'ﬁ'],
  Digit6: ['6', '^', '§', 'ﬂ'],
  Digit7: ['7', '&', '¶', '‡'],
  Digit8: ['8', '*', '•', '°'],
  Digit9: ['9', '(', 'ª', '·'],
  Digit0: ['0', ')', 'º', '‚'],
  Minus: ['-', '_', '–', '—'],
  Equal: ['=', '+', '≠', '±'],
  Backspace: ['Backspace', 'Backspace', 'Backspace', 'Backspace'],
  Tab: ['Tab', 'Tab', 'Tab', 'Tab'],
  KeyQ: ['q', 'Q', 'œ', 'Œ'],
  KeyW: ['w', 'W', '∑', '„'],
  KeyE: ['e', 'E', '´', '´'],
  KeyR: ['r', 'R', '®', '‰'],
  KeyT: ['t', 'T', '†', 'ˇ'],
  KeyY: ['y', 'Y', '¥', 'Á'],
  KeyU: ['u', 'U', '¨', '¨'],
  KeyI: ['i', 'I', 'ˆ', 'ˆ'],
  KeyO: ['o', 'O', 'ø', 'Ø'],
  KeyP: ['p', 'P', 'π', '∏'],
  BracketLeft: ['[', '{', '“', '”'],
  BracketRight: [']', '}', '‘', '’'],
  Backlash: ['\\', '|', '«', '»'],
  CapsLock: ['CapsLock', 'CapsLock', 'CapsLock', 'CapsLock'],
  KeyA: ['a', 'A', 'å', 'Å'],
  KeyS: ['s', 'S', 'ß', 'Í'],
  KeyD: ['d', 'D', '∂', 'Î'],
  KeyF: ['f', 'F', 'ƒ', 'Ï'],
  KeyG: ['g', 'G', '©', '˝'],
  KeyH: ['h', 'H', '˙', 'Ó'],
  KeyJ: ['j', 'J', '∆', 'Ô'],
  KeyK: ['k', 'K', '˚', ''],
  KeyL: ['l', 'L', '¬', 'Ò'],
  Semicolon: [';', ':', '…', 'Ú'],
  Quote: ["'", '"', 'æ', 'Æ'],
  Enter: ['Enter', 'Enter', 'Enter', 'Enter'],
  ShiftLeft: ['Shift', 'Shift', 'Shift', 'Shift'],
  KeyZ: ['z', 'Z', 'Ω', '¸'],
  KeyX: ['x', 'X', '≈', '˛'],
  KeyC: ['c', 'C', 'ç', 'Ç'],
  KeyV: ['v', 'V', '√', '◊'],
  KeyB: ['b', 'B', '∫', 'ı'],
  KeyN: ['n', 'N', '˜', '˜'],
  KeyM: ['m', 'M', 'µ', 'Â'],
  Comma: [',', '<', '≤', '¯'],
  Slash: ['/', '?', '÷', '¿'],
  Period: ['.', '>', '≥', '˘'],
  ShiftRight: ['Shift', 'Shift', 'Shift', 'Shift'],
  ControlLeft: ['Control', 'Control', 'Control', 'Control'],
  AltLeft: ['Alt', 'Alt', 'Alt', 'Alt'],
  MetaLeft: ['Meta', 'Meta', 'Meta', 'Meta'],
  Space: [' ', ' ', ' ', ' '],
  MetaRight: ['Meta', 'Meta', 'Meta', 'Meta'],
  AltRight: ['Alt', 'Alt', 'Alt', 'Alt'],
  ArrowLeft: ['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft'],
  ArrowUp: ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowUp'],
  ArrowDown: ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown'],
  ArrowRight: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight'],
}

export function isKeyPressed(system: System, key: string): boolean {
  const { input } = system
  const { keyboard } = input
  const { pressed } = keyboard

  const keyCode = keyToKeyCode[key]

  return pressed.indexOf(keyCode) > -1
}

export function isKeyRepeat($system: System): boolean {
  const { input: $input } = $system
  const { keyboard: $keyboard } = $input
  const { repeat: $repeat } = $keyboard
  return $repeat
}

export function isShiftPressed($system: System): boolean {
  return isKeyPressed($system, 'Shift')
}

export function isAltPressed($system: System): boolean {
  return isKeyPressed($system, 'Alt')
}

export const keyToIcon = {
  Enter: 'enter',
  Shift: 'shift',
  Backspace: 'backspace',
  ArrowDown: 'arrow-down',
  ArrowLeft: 'arrow-left',
  ArrowRight: 'arrow-right',
  ArrowUp: 'arrow-up',
  AltLeft: 'option',
  AltRight: 'option',
  CtrlRight: 'chevron-up',
  CtrlLeft: 'chevron-up',
  MetaLeft: 'cmd',
}
