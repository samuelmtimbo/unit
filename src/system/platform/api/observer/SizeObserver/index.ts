import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_SIZE_OBSERVER } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_
  opt: ResizeObserverOptions
  done: any
}

export type O = {
  width: number
  height: number
}

export default class SizeObserver extends Holder<I, O> {
  private _observer: ResizeObserver

  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        fo: [],
        i: [],
        o: ['width', 'height'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_SIZE_OBSERVER
    )
  }

  async f({ component, opt }: I, done: Done<O>) {
    const {
      api: {
        document: { ResizeObserver },
      },
    } = this.__system

    const observer_callback: ResizeObserverCallback = (
      entries: ResizeObserverEntry[]
    ) => {
      const entry = entries[0]

      const { width, height } = entry.contentRect

      this._output.width.push(width)
      this._output.height.push(height)
    }

    const observer = new ResizeObserver(observer_callback)

    this._observer = observer

    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component<HTMLElement>

    const leaf = component_.getFirstRootLeaf() as Component<HTMLElement>

    const { $node } = leaf

    this._observer.observe($node)
  }

  d() {
    if (this._observer) {
      this._observer.disconnect()

      this._observer = undefined
    }
  }
}
