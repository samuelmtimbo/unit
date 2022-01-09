import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: boolean
  b: boolean
}

export interface O {
  'a or b': boolean
}

export default class And extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a or b'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I, done): void {
    done({ 'a or b': a || b })
  }
}
