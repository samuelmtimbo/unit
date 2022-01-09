import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  A: string
}

export interface O {
  a: string
}

export default class ToLowerCase extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['A'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ A }: I, done): void {
    done({ a: A.toLowerCase() })
  }
}
