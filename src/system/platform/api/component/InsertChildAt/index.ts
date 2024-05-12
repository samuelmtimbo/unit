import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/composed/E'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { ID_INSERT_CHILD } from '../../../../_ids'

export interface I {
  parent: E
  child: UnitBundle<any>
  at: number
}

export interface O {}

export default class InsertChild extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent', 'child', 'at'],
        o: [],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
      },
      system,
      ID_INSERT_CHILD
    )
  }

  f({ parent, child, at }: I, done: Done<O>): void {
    parent.insertChild(child, at)

    done({ at })
  }
}
