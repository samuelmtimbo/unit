import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_XOR } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a ^ b': number
}

export default class XOr extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a ^ b'],
      },
      {},
      system,
      ID_XOR
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a ^ b': a ^ b })
  }
}
