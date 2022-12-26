import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/E'
import { ID_HAS_CHILD } from '../../../../_ids'

export interface I {
  parent: E
  at: number
}

export interface O {
  test: boolean
}

export default class HasChild extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent', 'at'],
        o: ['test'],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
      },
      system,
      ID_HAS_CHILD
    )
  }

  f({ parent, at }: I, done: Done<O>): void {
    const test = parent.hasChild(at)

    done({ test })
  }
}
