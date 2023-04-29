import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/E'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { ID_APPEND_CHILD } from '../../../../_ids'

export interface I {
  parent: E
  child: UnitBundle<any>
}

export interface O {
  at: number
}

export default class AppendChild extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent', 'child'],
        o: ['at'],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
      },
      system,
      ID_APPEND_CHILD
    )
  }

  f({ parent, child }: I, done: Done<O>): void {
    const at = parent.appendChild(child)

    done({ at })
  }
}
