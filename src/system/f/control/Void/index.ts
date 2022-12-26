import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_VOID } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {}

export default class Void<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
      },
      {},
      system,
      ID_VOID
    )
  }

  f({}, done: Done<O<T>>): void {
    done()
  }
}
