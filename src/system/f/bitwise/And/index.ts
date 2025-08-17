import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_AND } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a & b': number
}

export default class And extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a & b'],
      },
      {},
      system,
      ID_AND
    )
  }

  f({ a, b }: I, done: Done<O>): void {
    done({ 'a & b': a & b })
  }
}
