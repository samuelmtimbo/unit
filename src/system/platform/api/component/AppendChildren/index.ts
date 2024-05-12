import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/composed/E'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { ID_APPEND_CHILDREN } from '../../../../_ids'

export interface I {
  parent: E
  children: UnitBundle<any>[]
}

export interface O {
  length: number
}

export default class AppendChildren extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent', 'children'],
        o: ['length'],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
      },
      system,
      ID_APPEND_CHILDREN
    )
  }

  f({ parent, children }: I, done: Done<O>): void {
    const length = parent.appendChildren(children)

    done({ length })
  }
}
