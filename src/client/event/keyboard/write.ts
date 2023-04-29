import { System } from '../../../system'
import { clamp } from '../../../system/core/relation/Clamp/f'
import { isChar, keyToCode, keyToKeyCode } from './keyCode'

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

export function getActiveElement(system: System): Element {
  const activeElement = getWindowActiveElement(system, window)

  return activeElement
}

export function getWindowActiveElement(
  system: System,
  _window: Window
): Element {
  const { root } = system

  return root.shadowRoot.activeElement
}

export function emitKeyboardEvent(
  system: System,
  type: string,
  init: KeyboardEventInit
): void {
  const activeElement = getActiveElement(system)

  if (activeElement) {
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

      writeToElement(system, activeElement, key, init)
    }
  }
}

export function writeToActiveElement(system: System, key: string): Element {
  const activeElement = getActiveElement(system)

  writeToElement(system, activeElement, key)

  return activeElement
}

export function writeToElement(
  system: System,
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
  } else if (
    tagName === 'DIV' &&
    (element as HTMLDivElement).contentEditable === 'true'
  ) {
    writeToContentEditable(system, element as HTMLDivElement, key, modifier)
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
      nextSelectionStart = clamp(selectionStart - 1, 0, nextValue.length)
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
  const {
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

  const { maxLength } = input

  if (maxLength !== undefined && maxLength !== -1) {
    if (nextValue.length > maxLength) {
      return
    }
  }

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

export const getSelectionRange = (
  system: System
): {
  selectionStart: number
  selectionEnd: number
  selectionDirection: 'forward' | 'backward' | 'none' | null
} => {
  const {
    api: {
      document: { getSelection },
    },
  } = system

  const selection: Selection = getSelection()

  const range = selection.getRangeAt(0)

  return {
    selectionStart: range.startOffset,
    selectionEnd: range.endOffset,
    selectionDirection:
      range.startOffset === range.endOffset
        ? 'none'
        : range.startOffset < range.endOffset
        ? 'forward'
        : 'backward',
  }
}

// Selection is broken on Safari iOS (inside Shadow Root)
export function selectElementContents(
  system: System,
  element: HTMLDivElement,
  selectionStart: number,
  selectionEnd: number
) {
  const {
    api: {
      document: { createRange, getSelection },
    },
  } = system

  const range = createRange()

  if (!element.firstChild) {
    return
  }

  try {
    range.setStart(element.firstChild, selectionStart)
    range.setEnd(element.firstChild, selectionEnd)

    const selection = getSelection()

    selection.removeAllRanges()
    selection.addRange(range)
  } catch (err) {
    // swallow
  }
}

export function writeToContentEditable(
  system: System,
  input: HTMLDivElement,
  key: string,
  {
    ctrlKey,
    shiftKey,
    altKey,
  }: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
) {
  const value = input.innerText

  const {
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  } = getSelectionRange(system)

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
      selectElementContents(system, input, nextSelectionStart, nextSelectionEnd)
    }
  }

  if (nextValue !== value) {
    input.innerText = nextValue

    const inputEvent = new InputEvent('input', {})

    _setSelection()

    input.dispatchEvent(inputEvent)
  } else {
    _setSelection()
  }
}

export function emitKeyDown(system: System, key: string): void {
  const code = keyToCode[key]
  const keyCode = keyToKeyCode[key]
  emitKeyboardEvent(system, 'keydown', {
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

export function emitKeyUp(system: System, key: string): void {
  const code = keyToCode[key]
  const keyCode = keyToKeyCode[key]
  emitKeyboardEvent(system, 'keyup', {
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
