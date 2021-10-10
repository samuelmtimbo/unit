import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { EL } from '../../../../interface/EL'
import { UnitClass } from '../../../../types/UnitClass'

export interface I {
  parent: EL
  child: UnitClass<any>
}

export interface O {
  i: number
}

export default class AppendChild extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['parent', 'child'],
        o: ['i'],
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

  f({ parent, child }: I, done: Done<O>): void {
    const i = parent.appendChild(child)
    done({ i })
  }
}
