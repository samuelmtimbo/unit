import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_CONCAT_0 } from '../../../_ids'

export interface I {
  a: string
  b: string
}

export interface O {
  ab: string
}

export default class Concat extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      ID_CONCAT_0
    )
  }

  f({ a, b }: I, done): void {
    done({ ab: a + b })
  }
}
