import { Element_ } from '../../../../../Class/Element'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_SCROLL } from '../../../../_ids'

interface I<T> {
  component: Element_
  opt: any
}

interface O<T> {}

export default class Scroll<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
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
      ID_SCROLL
    )
  }

  async f({ component, opt }: I<T>, done: Done<O<T>>) {
    component.emit('call', {
      method: 'scroll',
      data: [opt],
    })

    done()
  }
}
