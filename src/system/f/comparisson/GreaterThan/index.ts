import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_GREATER_THAN } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a > b': boolean
}

export default class GreaterThan extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a > b'],
      },
      {},
      system,
      ID_GREATER_THAN
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a > b': a > b })
  }
}
