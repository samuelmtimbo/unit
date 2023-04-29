import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_OR_0 } from '../../../_ids'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a or b': boolean
}

export default class And extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a or b'],
      },
      {},
      system,
      ID_OR_0
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a or b': a || b })
  }
}
