import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  a: T
}

export interface O<T> {}

export default class Void<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
      },
      {},
      system,
      pod
    )
  }

  f({}, done: Done<O<T>>): void {
    done()
  }
}
