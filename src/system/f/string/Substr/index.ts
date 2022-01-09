import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  a: string
  from: number
  length: number
}

export interface O {
  a: string
}

export default class Substr extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'from', 'length'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, from, length }: I, done): void {
    done({ a: a.substr(from, length) })
  }
}
