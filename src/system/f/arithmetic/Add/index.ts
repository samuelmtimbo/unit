import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_ADD } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a + b': number
}

export default class Add extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a + b'],
      },
      {},
      system,
      ID_ADD
    )
  }

  f({ a, b }: I, done: Done<O>): void {
    done({ 'a + b': a + b })
  }
}
