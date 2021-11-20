import { IOElement } from './IOElement'

export default function stopPropagation(event: Event): void {
  event.stopPropagation()
}

export function stopByPropagation($element: IOElement, name: string): void {
  $element.addEventListener(
    name,
    (event: Event) => {
      event.stopPropagation()
      $element.dispatchEvent(
        new CustomEvent(`_${name}`, { detail: event, bubbles: event.bubbles })
      )
    },
    { passive: true, capture: false }
  )
}

const ALL: string[] = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'pointercancel',
  'pointerover',
  'pointerout',
  'click',
  'blur',
  'wheel',
  'scroll',
  'keypress',
  'keydown',
  'keyup',
]

export function stopAllPropagation($element: IOElement): void {
  ALL.forEach((name) => stopByPropagation($element, name))
}
