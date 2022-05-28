import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/E'
import { UnitBundle } from '../../../../../types/UnitBundle'

export interface I {
  parent: E
  child: UnitBundle<any>
}

export interface O {
  at: number
}

export default class AppendChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ parent, child }: I, done: Done<O>): void {
    const at = parent.appendChild(child)
    done({ at })
  }
}
