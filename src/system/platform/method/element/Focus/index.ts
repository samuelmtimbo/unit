import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_FOCUS } from '../../../../_ids'

export interface I<T> {
  component: Component_
  any: any
}

export interface O<T> {}

export default class Focus<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['component', 'any'],
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
      ID_FOCUS
    )
  }

  async f({ component, any }: I<T>, done: Done<O<T>>) {
    component.emit('call', { method: 'focus', data: undefined })

    done()
  }
}
