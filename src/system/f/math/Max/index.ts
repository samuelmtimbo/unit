import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  max: number
}

export default class Max<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'b'],
        o: ['max'],
      },
      {},
      system,
      pod
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ max: Math.max(a, b) })
  }
}
