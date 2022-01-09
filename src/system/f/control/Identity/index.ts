import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Identity<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({ a }: Partial<I<T>>, done): void {
    done({ a })
  }
}
