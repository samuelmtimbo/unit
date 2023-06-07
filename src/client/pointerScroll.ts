import { Unlisten } from '../types/Unlisten'
import { Component } from './component'
import { UnitPointerEvent } from './event/pointer'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerMoveListener } from './event/pointer/pointermove'

export function makePointerScroll(component: Component): Unlisten {
  let pointerDown = false
  let pointerMoveUnlisten
  let pointUpUnlisten
  const pointerDownUnlisten = component.addEventListener(
    makePointerDownListener(() => {
      pointerDown = true
      const pointerMoveListener = (event: UnitPointerEvent) => {}
      component.addEventListener(makePointerMoveListener(pointerMoveListener))
    })
  )

  return pointerDownUnlisten
}
