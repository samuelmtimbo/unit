import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_CLICK } from '../../../../_ids'

export interface I {
  component: Component_
  opt: {}
}

export interface O {
  done: any
}

export default class Click extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['component', 'opt'],
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
      ID_CLICK
    )
  }

  f({ component, opt }: I, done: Done<O>): void {
    component.emit('call', { method: 'click', data: [opt] })

    done({ done: true })
  }
}
