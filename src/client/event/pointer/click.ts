import { UnitPointerEvent } from '.'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../types/Unlisten'
import { callAll } from '../../../util/call/callAll'
import { Listener } from '../../Listener'
import { addListener } from '../../addListener'
import { Component } from '../../component'
import { stopPropagation } from '../../stopPropagation'
import { pointDistance } from '../../util/geometry'
import { Position } from '../../util/geometry/types'
import { setTimeoutRAF } from '../../util/timer/setTimeoutRAF'
import {
  CLICK_TIMEOUT,
  LONG_CLICK_TIMEOUT,
  POINTER_CLICK_RADIUS,
  POINTER_LONG_PRESS_MAX_DELTA,
} from './constants'
import { makePointerCancelListener } from './pointercancel'
import { listenPointerDown } from './pointerdown'
import { makePointerLeaveListener } from './pointerleave'
import { makePointerMoveListener } from './pointermove'
import { makePointerUpListener } from './pointerup'

export type Handlers = {
  onClick?: (event: UnitPointerEvent, _event: PointerEvent) => void
  onClickCancel?: (event: UnitPointerEvent) => void
  onDoubleClick?: (event: UnitPointerEvent) => void
  onLongClick?: (event: UnitPointerEvent) => void
  onLongPress?: (event: UnitPointerEvent, _event: PointerEvent) => void
  onLongClickCancel?: (event: UnitPointerEvent) => void
  onClickHold?: (event: UnitPointerEvent) => void
}

export function makeClickListener(handlers: Handlers): Listener {
  return (component: Component) => {
    return listenClick(component, handlers)
  }
}

export function listenClick(
  component: Component,
  handlers: Handlers
): () => void {
  const { $element, $system } = component

  const {
    onClick,
    onClickCancel,
    onDoubleClick,
    onLongPress,
    onLongClickCancel,
    onLongClick,
    onClickHold,
  } = handlers

  let tapCount: number = 0

  let pointerDown: Dict<Position> = {}
  let lastPointerDownPosition: Position
  let pointerDownCount: number = 0
  let pointerPosition: Dict<Position> = {}
  let pointerDownMaxDistance: Dict<number> = {}
  let lastTapPosition: Position
  let longClickCancelPointerId = new Set<number>()
  let longPress: Dict<boolean> = {}

  let doubleClickTimeout: Unlisten = null
  let longClickTimeout: Unlisten = null

  let unlisten: Unlisten | undefined = undefined

  let unlistenPointerMove: Unlisten | undefined = undefined
  let unlistenPointerUp: Unlisten | undefined = undefined
  let unlistenPointerLeave: Unlisten | undefined = undefined
  let unlistenPointerCancel: Unlisten | undefined = undefined

  const pointerDownListener = (
    event: UnitPointerEvent,
    _event: PointerEvent
  ) => {
    // console.log('pointerDownListener')

    const { pointerId } = event

    if (!pointerDown[pointerId]) {
      const { clientX, clientY } = event

      pointerDownCount++

      if (pointerDownCount === 1) {
        unlistenPointerMove = addListener(
          component,
          makePointerMoveListener(pointerMoveListener)
        )
        unlistenPointerUp = addListener(
          component,
          makePointerUpListener(pointerUpListener)
        )
        unlistenPointerLeave = addListener(
          component,
          makePointerLeaveListener(pointerLeaveListener)
        )
        unlistenPointerCancel = addListener(
          component,
          makePointerCancelListener(pointerCancelListener)
        )

        unlisten = callAll([
          unlistenPointerMove,
          unlistenPointerUp,
          unlistenPointerLeave,
          unlistenPointerCancel,
        ])
      }

      pointerPosition[pointerId] = { x: clientX, y: clientY }
      pointerDown[pointerId] = pointerPosition[pointerId]
      pointerDownMaxDistance[pointerId] = -Infinity

      if (pointerDownCount === 1) {
        if (
          tapCount === 0 ||
          (lastTapPosition &&
            pointDistance(lastTapPosition, { x: clientX, y: clientY }) >
              POINTER_CLICK_RADIUS)
        ) {
          if (longClickTimeout) {
            longClickTimeout()
          }

          longClickTimeout = setTimeoutRAF(
            $system,
            () => {
              if (
                tapCount === 0 &&
                pointerDown[pointerId] &&
                pointerDownCount === 1
              ) {
                longPress[pointerId] = true

                if (
                  pointerDownMaxDistance[pointerId] <
                  POINTER_LONG_PRESS_MAX_DELTA
                ) {
                  onLongPress && onLongPress(event, _event)
                }
              }

              longClickTimeout = null
            },
            LONG_CLICK_TIMEOUT
          )
        }

        if (
          tapCount === 1 &&
          pointDistance(pointerPosition[pointerId], lastPointerDownPosition) <=
            POINTER_CLICK_RADIUS
        ) {
          setTimeoutRAF(
            $system,
            () => {
              if (
                pointerDown[pointerId] &&
                pointerDownMaxDistance[pointerId] < POINTER_CLICK_RADIUS
              ) {
                onClickHold && onClickHold(event)
              }
            },
            LONG_CLICK_TIMEOUT
          )
        }
      } else {
        if (longClickTimeout) {
          longClickTimeout()

          longPress = {}

          longClickTimeout = null
        }
      }
    }
  }

  const pointerMoveListener = (event: UnitPointerEvent) => {
    // console.log('pointerMoveListener')

    const { clientX, clientY, pointerId } = event

    pointerPosition[pointerId] = { x: clientX, y: clientY }

    if (pointerDown[pointerId]) {
      pointerDownMaxDistance[pointerId] = Math.max(
        pointerDownMaxDistance[pointerId],
        pointDistance(pointerDown[pointerId], pointerPosition[pointerId])
      )

      if (
        !longClickCancelPointerId.has(pointerId) &&
        pointerDownMaxDistance[pointerId] >= POINTER_LONG_PRESS_MAX_DELTA
      ) {
        longClickCancelPointerId.add(pointerId)
        onLongClickCancel && onLongClickCancel(event)
      }
    }
  }

  const pointerCancelListener = ({ pointerId }) => {
    // console.log('pointerCancelListener')

    releasePointerDown(pointerId)
  }

  const pointerUpListener = (event: UnitPointerEvent, _event: PointerEvent) => {
    // console.log('pointerUpListener', event.pointerId)

    const { pointerId, clientX, clientY } = event

    const position = { x: clientX, y: clientY }

    if (pointerDown[pointerId]) {
      const pointerDownMovedDistance = pointDistance(
        pointerDown[pointerId],
        position
      )

      lastPointerDownPosition = pointerDown[pointerId]

      tapCount++

      const longClickCancel = longClickCancelPointerId.has(pointerId)

      if (longClickCancel) {
        longClickCancelPointerId.delete(pointerId)
      }

      if (
        tapCount === 2 &&
        pointerDownMaxDistance[pointerId] > POINTER_CLICK_RADIUS
      ) {
        tapCount = 1
        pointerDownMaxDistance[pointerId] = 0
        if (doubleClickTimeout) {
          doubleClickTimeout()
          doubleClickTimeout = null
        }
      }

      const d = pointDistance(position, lastPointerDownPosition)

      if (tapCount > 0 && tapCount % 2 === 1) {
        if (pointerDownMovedDistance < POINTER_CLICK_RADIUS) {
          doubleClickTimeout = setTimeoutRAF(
            $system,
            () => {
              tapCount = 0
              doubleClickTimeout = null
            },
            CLICK_TIMEOUT
          )
        } else {
          tapCount = 0
          doubleClickTimeout = null
        }

        if (d <= POINTER_CLICK_RADIUS && !longClickCancel) {
          if (longPress[pointerId]) {
            onLongClick && onLongClick(event)
          } else {
            onClick && onClick(event, _event)
          }
        } else {
          onClickCancel && onClickCancel(event)
        }
      }

      if (tapCount > 0 && tapCount % 2 === 0) {
        if (
          d <= POINTER_CLICK_RADIUS &&
          pointerDownMaxDistance[pointerId] <= POINTER_CLICK_RADIUS &&
          pointDistance(lastTapPosition, position) <= POINTER_CLICK_RADIUS
        ) {
          if (onDoubleClick) {
            onDoubleClick(event)
          } else if (onClick) {
            onClick(event, _event)
          }
        } else {
          onClick && onClick(event, _event)
        }
      }

      lastTapPosition = pointerPosition[pointerId]

      releasePointerDown(event)
    }
  }

  const pointerLeaveListener = (event: UnitPointerEvent) => {
    releasePointerDown(event)
  }

  const releasePointerDown = (event: UnitPointerEvent) => {
    const { pointerId } = event

    if (pointerDown[pointerId]) {
      delete pointerDown[pointerId]

      pointerDownCount--

      if (pointerDownCount === 0) {
        unlisten && unlisten()
        unlisten = undefined
      }

      delete longPress[pointerId]
    }
  }

  $element.addEventListener('click', stopPropagation)
  $element.addEventListener('dblclick', stopPropagation)

  const unlistenPointerDown = listenPointerDown(component, pointerDownListener)

  return () => {
    unlistenPointerDown()

    unlisten && unlisten()
    unlisten = undefined
  }
}
