import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_TO_LOWER_CASE } from '../../../_ids'

export interface I {
  A: string
}

export interface O {
  a: string
}

export default class ToLowerCase extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['A'],
        o: ['a'],
      },
      {},
      system,
      ID_TO_LOWER_CASE
    )
  }

  f({ A }: I, done): void {
    done({ a: A.toLowerCase() })
  }
}
