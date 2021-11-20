import { Moment } from '../debug/Moment'
import { PinDataMoment } from '../debug/PinDataMoment'
import { $Element } from '../interface/async/$Element'
import NOOP from '../NOOP'
import { Unlisten } from '../Unlisten'
import { Component } from './component'
import { IOElement } from './IOElement'
import { makeChangeListener } from './event/change'
import { makeCustomListener } from './event/custom'
import { makeInputListener } from './event/input'
import {
  makeKeydownListener,
  makeKeypressListener,
  makeKeyupListener,
} from './event/keyboard'
import { makePasteListener } from './event/paste'
import { makeClickListener } from './event/pointer/click'
import { makePointerDownListener } from './event/pointer/pointerdown'
import { makePointerEnterListener } from './event/pointer/pointerenter'
import { makePointerLeaveListener } from './event/pointer/pointerleave'
import { makePointerMoveListener } from './event/pointer/pointermove'
import { makePointerUpListener } from './event/pointer/pointerup'
import { Listener } from './Listener'
import { GlobalRefSpec } from '../types/GlobalRefSpec'

export function findRef(component: Component, name: string): Component | null {
  let c: Component | null = component
  while (c) {
    if (c.$ref[name]) {
      return c.$ref[name]
    }
    c = c.$parent
  }
  return null
}

export class Element<
  E extends IOElement = any,
  P extends object = {},
  U extends $Element = $Element
> extends Component<E, P, U> {
  private _element_unlisten: Unlisten

  onConnected($unit: $Element) {
    const setRef = (name: string, { __global_id, __ }: GlobalRefSpec): void => {
      __ = __.map((i) => {
        if (i.startsWith('$')) {
          return i
        } else {
          return `$${i}`
        }
      })

      const ref = $unit.$refGlobalObj({ __global_id, __ })

      this.setProp(name, ref)
    }

    const dropRef = (name: string): void => {
      this.setProp(name, undefined)
    }

    const handler = {
      unit: (moment: Moment) => {
        const { event: event_event, data: event_data } = moment
        if (event_event === 'set') {
          const { name, data } = event_data
          this.setProp(name, data)
        }
      },
      ref_input: (moment: PinDataMoment) => {
        const {
          event,
          data: { pinId, data },
        } = moment
        if (event === 'data') {
          setRef(pinId, data)
        } else {
          dropRef(pinId)
        }
      },
    }

    const element_listener = (moment: Moment): void => {
      const { type } = moment
      handler[type] && handler[type](moment)
    }

    const element_unlisten = this.$unit.$watch(
      { events: ['set', 'call', 'ref_input'] },
      element_listener
    )

    this._element_unlisten = element_unlisten

    $unit.$read({}, (state) => {
      for (let name in state) {
        const data = state[name]
        this.setProp(name, data)
      }
    })
  }

  onDisconnected() {
    console.log('Element', 'onDisconnected')
    this._element_unlisten()
  }

  set(name: string, data: any): void {
    if (this.$connected) {
      this.$unit.$set({ name, data }, NOOP)
    }
  }
}

export function makeEventListener(
  event: string,
  callback: (data: any) => void
): Listener {
  switch (event) {
    case 'click':
      return makeClickListener({ onClick: callback })
    case 'dbclick':
      return makeClickListener({ onDoubleClick: callback })
    case 'longpress':
      return makeClickListener({ onLongPress: callback })
    case 'longclick':
      return makeClickListener({ onLongClick: callback })
    case 'pointerdown':
      return makePointerDownListener(callback)
    case 'pointermove':
      return makePointerMoveListener(callback)
    case 'pointerup':
      return makePointerUpListener(callback)
    case 'pointerenter':
      return makePointerEnterListener(callback)
    case 'pointerleave':
      return makePointerLeaveListener(callback)
    case 'input':
      return makeInputListener(callback)
    case 'change':
      return makeChangeListener(callback)
    case 'paste':
      return makePasteListener(callback)
    case 'keydown':
      return makeKeydownListener(callback)
    case 'keyup':
      return makeKeyupListener(callback)
    case 'keypress':
      return makeKeypressListener(callback)
    default:
      return makeCustomListener(event, callback)
  }
}
