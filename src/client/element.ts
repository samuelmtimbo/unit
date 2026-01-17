import { Moment } from '../debug/Moment'
import { NOOP } from '../NOOP'
import { proxyWrap } from '../proxyWrap'
import { evaluate } from '../spec/evaluate'
import { stringify } from '../spec/stringify'
import { Dict } from '../types/Dict'
import { $Element } from '../types/interface/async/$Element'
import { Unlisten } from '../types/Unlisten'
import { Component } from './component'
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
import { IOElement } from './IOElement'
import { Listener } from './Listener'

export class Element<
  E extends IOElement = any,
  P extends Dict<any> = Dict<any>,
  U extends $Element = $Element,
> extends Component<E, P, U> {
  private _element_unlisten: Unlisten

  public $preventLoad: boolean = false
  public $input: Dict<string[]>
  public $$unit: $Element

  onConnected($unit: $Element) {
    this.$$unit = proxyWrap($unit, ['V', 'J'])

    const handler = {
      unit: (moment: Moment) => {
        const { specs, classes } = this.$system

        const { event: event_event, data: event_data } = moment

        if (event_event === 'set') {
          const { name, data } = event_data

          if (data !== undefined) {
            const _data = evaluate(data, specs, classes, (url) => {
              const globalId = url.slice(7)

              const __ = this.$input[name] ?? []

              return this.$$unit.$refGlobalObj({ globalId, __ })
            })

            this.setProp(name, _data)
          } else {
            this.setProp(name, undefined)
          }
        }
      },
    }

    const element_listener = (moment: Moment): void => {
      const { type } = moment

      handler[type] && handler[type](moment)
    }

    const element_unlisten = this.$$unit.$watch(
      { events: ['set', 'call'] },
      element_listener
    )

    this._element_unlisten = element_unlisten

    if (!this.$preventLoad) {
      this.$$unit.$read({}, (state) => {
        const { specs, classes } = this.$system

        state = evaluate(state, specs, classes, (url) => {
          return url
        })

        for (const name in this.$input) {
          const url = state[name]

          if (url) {
            const globalId = url.slice(7)

            const __ = this.$input[name]

            state[name] = this.$$unit.$refGlobalObj({ globalId, __ })
          }
        }

        for (const name in state) {
          const data = state[name]

          this.setProp(name as keyof P, data)
        }
      })
    }
  }

  onDisconnected() {
    this._element_unlisten()
  }

  set(name: string, data: any): void {
    if (this.$connected) {
      const value = stringify(data)

      this.$$unit.$set({ name, data: value }, NOOP)
    }
  }

  click() {
    if (this.$element instanceof HTMLElement) {
      this.$element.click()
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
