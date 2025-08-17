import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_IDENTITY } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Identity<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      {},
      system,
      ID_IDENTITY
    )
  }

  f({ a }: Partial<I<T>>, done: Done<O<T>>): void {
    done({ a })
  }
}
