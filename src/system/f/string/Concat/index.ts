import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string
  b: string
}

export interface O {
  ab: string
}

export default class Concat extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I, done): void {
    done({ ab: a + b })
  }
}
