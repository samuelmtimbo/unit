import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { CH } from '../../../../../types/interface/CH'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { C } from '../../../../../types/interface/C'
import { Component_ } from '../../../../../types/interface/Component'

interface I<T> {
  component: Component_
  opt: any
}

interface O<T> {}

export default class ScrollIntoView<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['component', 'opt'],
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
      pod
    )
  }

  async f({ component, opt }: I<T>, done: Done<O<T>>) {
    component.refEmitter().emit('call', {
      method: 'scrollIntoView',
      data: [opt],
    })

    done({})
  }
}
