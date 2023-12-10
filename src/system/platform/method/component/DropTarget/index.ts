import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_DROP_TARGET } from '../../../../_ids'

export interface I<T> {
  component: Component_<any>
}

export interface O<T> {
  items: string[]
}

export default class DropTarget<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['component'],
        i: [],
        o: ['items'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_DROP_TARGET
    )
  }

  async f({ component }: I<T>, done: Done<O<T>>) {
    // console.log('DropTarget', 'f')

    setTimeout(() => {
      component.emit('call', { method: 'attachDropTarget', data: [] })
    }, 0)

    component.addListener('drop', (items: string[]) => {
      this._output.items.push(items)
    })
  }
}
