import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { PositionObserver } from '../../../../../client/PositionObserver'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { IPositionObserverCallback } from '../../../../../types/global/IPositionObserver'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_POSITION_OBSERVER } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_
  opt: {}
  done: any
}

export type O = {
  entry: { x: number; y: number }
}

export default class PositionObserver_ extends Semifunctional<I, O> {
  private _observer: PositionObserver

  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        fo: [],
        i: ['done'],
        o: ['entry'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_POSITION_OBSERVER
    )

    const {
      api: {
        document: { PositionObserver },
      },
    } = this.__system

    const observer_callback: IPositionObserverCallback = (
      x: number,
      y: number
    ) => {
      this._output.entry.push({ x, y })
    }

    const observer = new PositionObserver(this.__system, observer_callback)

    this._observer = observer
  }

  async f({ component }: I, done: Done<O>) {
    const {
      api: {
        document: { PositionObserver },
      },
    } = this.__system

    const globalId = component.getGlobalId()

    const _component = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component<HTMLElement>

    const leaf = _component.getFirstRootLeaf() as Component<HTMLElement>

    this._observer.observe(leaf.$element)
  }

  d() {
    // TODO
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    if (this._observer) {
      this._observer.disconnect()
    }
    // }
  }
}
