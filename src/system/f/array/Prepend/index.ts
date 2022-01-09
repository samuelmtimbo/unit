import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T[]
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Prepend<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ a: [b, ...a] })
  }
}
