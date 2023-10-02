import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_BLUR } from '../../../../_ids'

export interface I<T> {
  component: Component_
  any: {}
}

export interface O<T> {}

export default class Blur<T> extends Functional<I<T>, O<T>> {
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
      ID_BLUR
    )
  }

  async f({ component, any }: I<T>, done: Done<O<T>>) {
    component.emit('call', { method: 'blur', data: undefined })

    done()
  }
}
