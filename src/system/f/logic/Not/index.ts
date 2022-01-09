import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: boolean
}

export interface O {
  '!a': boolean
}

export default class Not extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['!a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I, done): void {
    done({ '!a': !a })
  }
}
