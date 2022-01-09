import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
  b: T[]
}

export interface O<T> {
  ab: T[]
}

export default class Concat<T> extends Functional<I<T>, O<T>> {
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

  f({ a, b }: I<T>, done): void {
    done({ ab: a.concat(b) })
  }
}
