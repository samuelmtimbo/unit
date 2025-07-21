import { Functional } from '../../../../Class/Functional'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_REMAINDER } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a % b': number
}

export default class Remainder extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a % b'],
      },
      {},
      system,
      ID_REMAINDER
    )
  }

  f({ a, b }: I, done, fail: Fail): void {
    if (b === 0) {
      fail('cannot divide by 0')
    } else {
      done({ 'a % b': a % b })
    }
  }
}
