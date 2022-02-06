import { System } from '../../../system'
import isEqual from '../../../system/f/comparisson/Equals/f'
import { Dict } from '../../../types/Dict'
import { randomIdNotIn } from '../../../util/id'
import { addGlobalBlurListener } from '../../addGlobalBlurListener'
import { IOElement } from '../../IOElement'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'
import { isChar, keyCodeToKey, keyToCode, keyToKeyCode } from './keyCode'

const isAlphaNumCharOrSpace = (str: string): boolean => {
  return /[a-zA-Z\d\s:]/.test(str)
}

const isAlphaNumChar = (str: string): boolean => {
  return /[a-zA-Z\d:]/.test(str)
}

const isSpace = (str: string): boolean => {
  return /[\s]/.test(str)
}

const findPrevAltIndex = (value: string, selectionStart: number): number => {
  let i = selectionStart
  if (selectionStart > 0) {
    if (!isAlphaNumCharOrSpace(value[i - 1])) {
      while (!isAlphaNumCharOrSpace(value[i - 1]) && i > 0) {
        i--
      }
    } else if (isSpace(value[i - 1])) {
      while (isSpace(value[i - 1]) && i > 0) {
        i--
      }
      i = findPrevAltIndex(value, i)
    } else {
      while (isAlphaNumChar(value[i - 1]) && i > 0) {
        i--
      }
    }
  }
  return i
}

const findNextAltIndex = (value: string, selectionStart: number): number => {
  let i = selectionStart
  if (!isAlphaNumCharOrSpace(value[selectionStart])) {
    while (!isAlphaNumCharOrSpace(value[i]) && i < value.length) {
      i++
    }
  } else if (isSpace(value[selectionStart])) {
    while (isSpace(value[i]) && i < value.length) {
      i++
    }
    i = findNextAltIndex(value, i)
  } else {
    while (isAlphaNumChar(value[i]) && i < value.length) {
      i++
    }
  }
  return i
}

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
  // return false
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
    if (Object.keys(this._shortcuts).length === 1) {
      this._listen()
    }
    return id
  }

  public removeShortcutGroup(id: string): void {
    delete this._shortcuts[id]
    if (Object.keys(this._shortcuts).length === 0) {
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
    for (let id in this._shortcuts) {
      const shortcutGroup = this._shortcuts[id]
      const currentCombo = this.getCurrentCombo()
      const currentComboStr = currentCombo.join('+')
      for (let shortcut of shortcutGroup) {
        let match = false
        if (
          (type === 'keydown' && shortcut.keydown) ||
          (type === 'keyup' && shortcut.keyup)
        ) {
          let { combo, strict } = shortcut
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

  private _keydown = (keyCode: number) => {
    const index: number = this._pressed.indexOf(keyCode)
    // const previous = this.getCurrentCombo()
    if (index === -1) {
      this._pressed.push(keyCode)
    }
    // const current = this.getCurrentCombo()
    // console.log('_keydown', `${previous} -> ${current}`)
    const filtered = this._filterShortcuts('keydown')
    for (let shortcut of filtered) {
      if (this._repeat && !shortcut.multiple) {
        continue
      }
      const key = keyCodeToKey[keyCode]
      shortcut.keydown!(key, {
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
      for (let shortcut of filtered) {
        shortcut.keyup!(key, {
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

    this._keydown(keyCode)
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

export function getActiveElement(): Element {
  const activeElement = getWindowActiveElement(window)
  return activeElement
}

export function getWindowActiveElement(_window: Window): Element {
  let activeElement =
    _window.document.activeElement || _window.document.documentElement
  if (activeElement.tagName === 'IFRAME') {
    const __window = (activeElement as HTMLIFrameElement).contentWindow
    if (__window) {
      activeElement = getWindowActiveElement(__window)
    }
  }
  return activeElement
}

export function emitKeyboardEvent(type: string, init: KeyboardEventInit): void {
  const activeElement = getActiveElement()
  const event = new KeyboardEvent(type, init)
  const _preventDefault = event.preventDefault.bind(event)
  let defaultPrevented = false
  event.preventDefault = () => {
    defaultPrevented = true
    return _preventDefault()
  }
  activeElement.dispatchEvent(event)
  if (event.type === 'keydown' && !defaultPrevented) {
    const { key } = event
    writeToElement(activeElement, key, init)
  }
}

export function writeToActiveElement(key: string): void {
  const activeElement = getActiveElement()
  writeToElement(activeElement, key)
}

export function writeToElement(
  element: Element,
  key: string,
  modifier: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  const { tagName } = element
  // https://stackoverflow.com/questions/26723648/check-whether-an-html-element-is-editable-or-not-using-js
  if (
    (tagName === 'INPUT' &&
      /^(?:text|email|search|tel|url|password)$/i.test(
        (element as HTMLInputElement).type
      )) ||
    tagName === 'TEXTAREA'
  ) {
    writeToInput(element as HTMLInputElement, key, modifier)
  }
}

export type TextState = {
  value: string
  selectionStart: number
  selectionEnd: number
  selectionDirection: 'forward' | 'backward' | 'none'
}

export function processKeydown(
  {
    value,
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  }: TextState,
  { ctrlKey, shiftKey, altKey },
  key: string
): TextState {
  if (selectionStart === null) {
    selectionStart = 0
  }
  if (selectionEnd === null) {
    selectionEnd = selectionStart
  }
  let nextValue = value
  let nextSelectionStart = selectionStart
  let nextSelectionEnd = selectionEnd
  let nextSelectionDirection: 'forward' | 'backward' | 'none' =
    selectionDirection

  if (isChar(key)) {
    nextValue =
      value.substr(0, selectionStart) +
      key +
      value.substr(selectionEnd, value.length)
    nextSelectionStart = selectionStart + 1
    nextSelectionEnd = nextSelectionStart
  } else {
    if (key === 'Backspace') {
      if (selectionStart === selectionEnd) {
        nextValue =
          value.substr(0, selectionStart - 1) +
          value.substr(selectionStart, value.length)
      } else {
        nextValue =
          value.substr(0, selectionStart) +
          value.substr(selectionEnd, value.length)
      }
      nextSelectionStart = selectionStart - 1
      nextSelectionEnd = nextSelectionStart
    } else if (key === 'Enter') {
      nextValue =
        value.substr(0, selectionStart) +
        '\n' +
        value.substr(selectionEnd, value.length)
      nextSelectionStart = selectionStart + 1
      nextSelectionEnd = nextSelectionStart
    } else if (key === 'Space') {
      nextValue =
        value.substr(0, selectionStart) +
        ' ' +
        value.substr(selectionEnd, value.length)
      nextSelectionStart = selectionStart + 1
      nextSelectionEnd = nextSelectionStart
    } else if (key === 'ArrowLeft') {
      if (shiftKey && altKey) {
        if (
          selectionDirection === 'backward' ||
          selectionDirection === 'none' ||
          selectionStart === selectionEnd
        ) {
          nextSelectionStart = findPrevAltIndex(value, selectionStart)
          nextSelectionDirection = 'backward'
        } else {
          nextSelectionEnd = findPrevAltIndex(value, selectionEnd)
          if (nextSelectionEnd === selectionStart) {
            nextSelectionDirection = 'backward'
          }
        }
      } else if (shiftKey) {
        if (selectionStart > 0) {
          nextSelectionStart = selectionStart - 1
        }
      } else if (altKey) {
        nextSelectionStart = findPrevAltIndex(value, selectionStart)
        nextSelectionEnd = nextSelectionStart
      } else {
        if (selectionStart === selectionEnd) {
          nextSelectionStart = selectionStart - 1
          nextSelectionEnd = nextSelectionStart
        } else {
          nextSelectionEnd = selectionStart
        }
      }
    } else if (key === 'ArrowRight') {
      if (shiftKey && altKey) {
        if (
          selectionDirection === 'forward' ||
          selectionDirection === 'none' ||
          selectionStart === selectionEnd
        ) {
          nextSelectionEnd = findNextAltIndex(value, selectionEnd)
          nextSelectionDirection = 'forward'
        } else {
          nextSelectionStart = findNextAltIndex(value, selectionStart)
          if (nextSelectionStart === selectionEnd) {
            nextSelectionDirection = 'forward'
          }
        }
      } else if (shiftKey) {
        if (selectionStart > 0) {
          nextSelectionEnd = nextSelectionEnd + 1
        }
      } else if (altKey) {
        nextSelectionStart = findNextAltIndex(value, selectionStart)
        nextSelectionEnd = nextSelectionStart
      } else {
        if (selectionStart === selectionEnd) {
          nextSelectionStart = selectionStart + 1
          nextSelectionEnd = nextSelectionStart
        } else {
          nextSelectionStart = selectionEnd
        }
      }
    }
  }

  return {
    value: nextValue,
    selectionStart: nextSelectionStart,
    selectionEnd: nextSelectionEnd,
    selectionDirection: nextSelectionDirection,
  }
}

export function writeToInput(
  input: HTMLInputElement,
  key: string,
  {
    ctrlKey,
    shiftKey,
    altKey,
  }: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  let {
    value,
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  } = input

  const {
    value: nextValue,
    selectionStart: nextSelectionStart,
    selectionEnd: nextSelectionEnd,
    selectionDirection: nextSelectionDirection,
  } = processKeydown(
    {
      value,
      selectionStart,
      selectionEnd,
      selectionDirection,
    },
    { ctrlKey, shiftKey, altKey },
    key
  )

  function _setSelection() {
    if (
      nextSelectionStart !== selectionStart ||
      nextSelectionEnd !== selectionEnd
    ) {
      input.setSelectionRange(
        nextSelectionStart,
        nextSelectionEnd,
        nextSelectionDirection
      )
      input.selectionDirection = nextSelectionDirection
    }
  }

  if (nextValue !== value) {
    input.value = nextValue
    // TODO
    // inputType: (Optional) A string specifying the type of change for editible content such as, for example, inserting, deleting, or formatting text.
    // data: (Optional) A string containing characters to insert. This may be an empty string if the change doesn't insert text (such as when deleting characters, for example).
    // dataTransfer: (Optional) A DataTransfer object containing information about richtext or plaintext data being added to or removed from editible content.
    // isComposing: (Optional) A boolean indicating that the event is part of a composition session, meaning it is after a compositionstart event but before a compositionend event.  The default is false.
    // ranges: (Optional) An array of static ranges that will be affected by a change to the DOM if the input event is not canceled.
    const inputEvent = new InputEvent('input', {})
    // selection must be set before dispatching input
    _setSelection()
    input.dispatchEvent(inputEvent)
  } else {
    _setSelection()
  }
}

export function emitKeyDown(key: string): void {
  const code = keyToCode[key]
  const keyCode = keyToKeyCode[key]
  emitKeyboardEvent('keydown', {
    key: code,
    // @ts-ignore
    keyCode,
    code,
    // TODO shiftKey, ctrlKey, ...
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
}

export function emitKeyUp(key: string): void {
  const code = keyToCode[key]
  const keyCode = keyToKeyCode[key]
  emitKeyboardEvent('keyup', {
    key: code,
    // @ts-ignore
    keyCode,
    code,
    // TODO shiftKey, ctrlKey, ...
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    bubbles: true,
  })
}

export function isKeyPressed($system: System, key: string): boolean {
  const { input: $input } = $system

  const { keyboard: $keyboard } = $input

  const { pressed: $pressed } = $keyboard

  const keyCode = keyToKeyCode[key]

  return $pressed.indexOf(keyCode) > -1
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
