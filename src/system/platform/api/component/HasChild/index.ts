import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { E } from '../../../../../interface/E'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  parent: E
  at: number
}

export interface O {
  has: boolean
}

export default class HasChild extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['parent', 'at'],
        o: ['has'],
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
    const has = parent.hasChild(at)
    done({ has })
  }
}
