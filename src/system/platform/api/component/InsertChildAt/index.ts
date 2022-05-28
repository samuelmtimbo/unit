import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/E'
import { UnitBundle } from '../../../../../types/UnitBundle'

export interface I {
  parent: E
  child: UnitBundle<any>
  at: number
}

export interface O {}

export default class InsertChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ parent, child, at }: I, done: Done<O>): void {
    parent.insertChild(child, at)

    done({ at })
  }
}
