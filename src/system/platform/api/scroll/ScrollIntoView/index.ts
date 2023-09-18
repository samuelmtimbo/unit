import { Element_ } from '../../../../../Class/Element'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_SCROLL_INTO_VIEW } from '../../../../_ids'

interface I<T> {
  component: Element_
  opt: any
}

interface O<T> {}

export default class ScrollIntoView<T> extends Functional<I<T>, O<T>> {
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
      ID_SCROLL_INTO_VIEW
    )
  }

  async f({ component, opt }: I<T>, done: Done<O<T>>) {
    component.emit('call', {
      method: 'scrollIntoView',
      data: [opt],
    })

    done()
  }
}
