import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { E } from '../../../../interface/E'

export interface I {
  parent: E
  at: number
}

export interface O {
  has: boolean
}

export default class HasChild extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['parent', 'at'],
        o: ['has'],
      },
      config,
      {
        input: {
          parent: {
            ref: true,
          },
        },
      }
    )
  }

  f({ parent, at }: I, done: Done<O>): void {
    const has = parent.hasChild(at)
    done({ has })
  }
}
