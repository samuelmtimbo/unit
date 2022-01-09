import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: number
  b: number
}

export interface O {
  'a < b': boolean
}

export default class LessThan extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a < b'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a < b': a < b })
  }
}
