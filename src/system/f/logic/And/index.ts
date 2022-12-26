import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_AND_0 } from '../../../_ids'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a and b': boolean
}

export default class And extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a and b'],
      },
      {},
      system,
      ID_AND_0
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a and b': a && b })
  }
}
