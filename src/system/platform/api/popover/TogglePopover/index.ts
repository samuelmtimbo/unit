import { Element_ } from '../../../../../Class/Element'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_TOGGLE_POPOVER } from '../../../../_ids'

export type I = {
  component: Element_
  any: any
}

export type O = {}

export default class TogglePopover extends Functional<I, O> {
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
      ID_TOGGLE_POPOVER
    )
  }

  f({ component }: I, done: Done<O>): void {
    component.emit('call', {
      method: 'togglePopover',
      data: [],
    })

    done()
  }
}
