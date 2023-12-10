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

  async f({ component, name }: I<T>, done: Done<O<T>>) {
    component.emit('call', { method: 'stopPropagation', data: [name] })
  }

  public onIterDataInputData(name: string, data: any): void {
    if (name === 'done') {
      // TODO

      this._done()

      this.takeInput('done')
    }
  }
}
