export default function stopPropagation(event: Event): void {
  event.stopPropagation()
}

export function stopByPropagation(
  $element: HTMLElement | SVGElement,
  name: string
): void {
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

export function stopAllPropagation($element: HTMLElement | SVGElement): void {
  ALL.forEach((name) => stopByPropagation($element, name))
}
