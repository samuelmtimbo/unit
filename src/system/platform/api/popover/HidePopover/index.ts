import { Element_ } from '../../../../../Class/Element'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { ID_HIDE_POPOVER } from '../../../../_ids'

export type I = {
  component: Element_
  any: any
}

export type O = {}

export default class HidePopover extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'any'],
        fo: [],
        i: [],
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
      ID_HIDE_POPOVER
    )
  }

  f({ component }: I, done: Done<O>): void {
    component.emit('call', {
      method: 'hidePopover',
      data: [],
    })

    done()
  }
}
