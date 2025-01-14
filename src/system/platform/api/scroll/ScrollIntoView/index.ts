import { Element_ } from '../../../../../Class/Element'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { ID_SCROLL_INTO_VIEW } from '../../../../_ids'

interface I<T> {
  component: Element_
  opt: any
}

interface O<T> {
  done: any
}

export default class ScrollIntoView<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        fo: [],
        i: [],
        o: ['done'],
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

  d() {
    this._output.done.push(true)
  }
}
