import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_STOP_PROPAGATION } from '../../../../_ids'

export interface I<T> {
  component: Component_
  name: string
  done: any
}

export interface O<T> {}

export default class StopPropagation<T> extends Semifunctional<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'name'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_STOP_PROPAGATION
    )
  }

  async f({ component, name }: I<T>, done: Done<O<T>>) {
    this._unlisten = component.stopPropagation(name)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this.d()

    this._done()

    this.takeInput('done')
    // }
  }
}
