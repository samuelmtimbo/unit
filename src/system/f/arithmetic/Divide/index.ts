import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_DIVIDE } from '../../../_ids'

export interface I {
  a: number
  b: number
}

export interface O {
  'a ÷ b': number
}

export default class Divide extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a ÷ b'],
      },
      {},
      system,
      ID_DIVIDE
    )
  }

  f({ a, b }: I, done: Done<O>, fail: Fail): void {
    if (b === 0) {
      fail('cannot divide by 0')
    } else {
      done({ 'a ÷ b': a / b })
    }
  }
}
