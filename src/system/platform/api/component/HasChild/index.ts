import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { E } from '../../../../../types/interface/E'

export interface I {
  parent: E
  at: number
}

export interface O {
  test: boolean
}

export default class HasChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  f({ parent, at }: I, done: Done<O>): void {
    const test = parent.hasChild(at)

    done({ test })
  }
}
