import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T
  signal: any
}

export interface O<T> {
  a: T
}

export default class Wait<T> extends Functional<I<T>, O<T>> {
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

  f({ a }: I<T>, done): void {
    done({ a })
  }
}
