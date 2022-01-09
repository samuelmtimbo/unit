import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  min: number
}

export default class Min<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['min'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ min: Math.min(a, b) })
  }
}
