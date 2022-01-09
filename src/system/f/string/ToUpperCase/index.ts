import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string
}

export interface O {
  A: string
}

export default class ToUpperCase extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['A'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I, done): void {
    done({ A: a.toUpperCase() })
  }
}
