import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: number
  b: number
}

export interface O {
  'a % b': number
}

export default class Remainder extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a % b'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I, done): void {
    if (b === 0) {
      done(undefined, 'cannot divide by 0')
    } else {
      done({ 'a % b': a % b })
    }
  }
}
