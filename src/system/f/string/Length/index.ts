import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string
}

export interface O {
  length: number
}

export default class Length extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: I, done): void {
    done({ length: a.length })
  }
}
