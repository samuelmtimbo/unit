import { Unlisten } from '../Unlisten'
import { Component } from './component'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerEnterListener } from './event/pointer/pointerenter'
import { makePointerLeaveListener } from './event/pointer/pointerleave'
import { makePointerMoveListener } from './event/pointer/pointermove'
import { makePointerUpListener } from './event/pointer/pointerup'

export const listenMovement = (
  component: Component,
  callback: () => void
): Unlisten => {
  return component.addEventListeners([
    makePointerEnterListener(() => {
      callback()
    }),
    makePointerMoveListener(() => {
      callback()
    }),
    makePointerLeaveListener(() => {
      callback()
    }),
    makePointerDownListener(() => {
      callback()
    }),
    makePointerUpListener(() => {
      callback()
    }),
  ])
}
