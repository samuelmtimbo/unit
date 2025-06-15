import { System } from '../../../system'
import { clamp } from '../../../system/core/relation/Clamp/f'
import { getActiveElement } from '../../activeElement'
import { isContentEditable } from '../../isContentEditable'
import { isTextField } from '../../isTextField'
import { isChar } from './key'

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

      keydownElement(system, activeElement, key, init)
    }
  }
}

export function keydownActiveElement(system: System, key: string): Element {
  const activeElement = getActiveElement(system)

  keydownElement(system, activeElement, key)

  return activeElement
}

export function keydownElement(
  system: System,
  element: Element,
  key: string,
  modifier: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  if (isTextField(element as HTMLElement)) {
    writeToInput(element as HTMLInputElement, key, modifier)
  } else if (isContentEditable(element as HTMLDivElement)) {
    keydownContentEditable(system, element as HTMLDivElement, key, modifier)
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
      processBackspace(
        { value, selectionStart, selectionEnd, selectionDirection },
        { ctrlKey, shiftKey, altKey }
      )
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

export function processBackspace(
  {
    value,
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  }: TextState,
  { ctrlKey, shiftKey, altKey }
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

  if (selectionStart === selectionEnd) {
    nextValue =
      value.substr(0, selectionStart - 1) +
      value.substr(selectionStart, value.length)
  } else {
    nextValue =
      value.substr(0, selectionStart) + value.substr(selectionEnd, value.length)
  }
  nextSelectionStart = clamp(selectionStart - 1, 0, nextValue.length)
  nextSelectionEnd = nextSelectionStart

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

// Selection is broken on Safari (iOS) (inside Shadow Root)
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

export function keydownContentEditable(
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

export function writeToContentEditable(
  system: System,
  input: HTMLDivElement,
  value: string
) {
  const current = input.innerText

  const {
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  } = getSelectionRange(system)

  input.innerText =
    current.slice(0, selectionStart) +
    value +
    current.slice(selectionEnd, Infinity)

  const nextSelectionStart = selectionStart
  const nextSelectionEnd = selectionStart + value.length

  selectElementContents(system, input, nextSelectionStart, nextSelectionEnd)

  input.dispatchEvent(new InputEvent('input', {}))
}

export function writeToTextField(
  system: System,
  input: HTMLInputElement | HTMLTextAreaElement,
  value: string
) {
  const current = input.value

  const {
    selectionStart = 0,
    selectionEnd = 0,
    selectionDirection = 'none',
  } = input

  input.value =
    current.slice(0, selectionStart) +
    value +
    current.slice(selectionEnd, Infinity)

  const nextSelectionStart = selectionStart
  const nextSelectionEnd = selectionStart + value.length

  input.setSelectionRange(nextSelectionStart, nextSelectionEnd, 'forward')

  input.dispatchEvent(new InputEvent('input', {}))
}
