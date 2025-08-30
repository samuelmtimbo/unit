import { $ } from '../../../../../Class/$'
import { Holder } from '../../../../../Class/Holder'
import { Component } from '../../../../../client/component'
import {
  UIEventName,
  makeUIEventListener,
} from '../../../../../client/makeEventListener'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { EV } from '../../../../../types/interface/E'
import { V } from '../../../../../types/interface/V'
import { Unlisten } from '../../../../../types/Unlisten'
import { wrapEvent } from '../../../../../wrap/Event'
import { ID_LISTENER } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export interface I<T> {
  component: Component_<any>
  event: string
  done: string
}

export interface O<T> {
  event: EV & V & $
  data: any
}

export default class Listener<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['component', 'event'],
        fo: ['data', 'event'],
        i: [],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
        output: {
          event: {
            ref: true,
          },
        },
      },
      system,
      ID_LISTENER
    )
  }

  async f({ component, event }: I<T>) {
    const listener = (data: any, event_: Event) => {
      const $event = wrapEvent(event_, data, this.__system)

      this._output.event.push($event)
      this._output.data.push(data)
    }

    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component

    const listener_ = makeUIEventListener(event as UIEventName, listener)

    this._unlisten = component_.addEventListener(listener_)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
