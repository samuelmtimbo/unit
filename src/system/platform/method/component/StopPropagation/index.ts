import { Unlisten } from '@_unit/unit/lib/types/Unlisten'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_STOP_PROPAGATION } from '../../../../_ids'

export interface I<T> {
  component: Component_
  name: string
}

export interface O<T> {}

export default class StopPropagation<T> extends Semifunctional<I<T>, O<T>> {
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

  private _unlisten: Unlisten

  async f({ component, name }: I<T>, done: Done<O<T>>) {
    this._unlisten = component.stopPropagation(name)
  }

  d() {
    this._cancel()
  }

  i() {
    this._cancel()
  }

  private _cancel = () => {
    if (this._unlisten) {
      this._unlisten()
      this._unlisten = undefined

      this._done()
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    if (name === 'done') {
      this._cancel()

      this.takeInput('done')
    }
  }
}
