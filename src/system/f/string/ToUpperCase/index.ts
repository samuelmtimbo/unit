import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_TO_UPPER_CASE } from '../../../_ids'

export interface I {
  a: string
}

export interface O {
  A: string
}

export default class ToUpperCase extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['A'],
      },
      {},
      system,
      ID_TO_UPPER_CASE
    )
  }

  f({ a }: I, done: Done<O>): void {
    done({ A: a.toUpperCase() })
  }
}
