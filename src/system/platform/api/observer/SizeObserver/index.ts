import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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

export default class SizeObserver extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        fo: [],
        i: ['done'],
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
  }

  private _observer: ResizeObserver

  async f({ component, opt }: I, done: Done<O>) {
    const {
      api: {
        document: { ResizeObserver },
      },
    } = this.__system

    const globalId = component.getGlobalId()

    let _component = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component<HTMLElement>

    const leaf = _component.getFirstRootLeaf() as Component<HTMLElement>

    const { $node } = leaf

    this._observer.observe($node)
  }

  d() {
    this._observer.disconnect()
  }

  i() {
    this.d()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this.d()

    this._forward_all_empty()

    this._backward('opt')
    this._backward('done')
    // }
  }
}
