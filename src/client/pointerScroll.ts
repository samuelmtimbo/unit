import { Unlisten } from '../Unlisten'
import { Component } from './component'
import { IOPointerEvent } from './event/pointer'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerMoveListener } from './event/pointer/pointermove'

export function makePointerScroll(component: Component): Unlisten {
  let pointerDown = false
  let pointerMoveUnlisten
  let pointUpUnlisten
  const pointerDownUnlisten = component.addEventListener(
    makePointerDownListener(() => {
      pointerDown = true
      const pointerMoveListener = (event: IOPointerEvent) => {}
      component.addEventListener(makePointerMoveListener(pointerMoveListener))
    })
  )

  return pointerDownUnlisten
}
