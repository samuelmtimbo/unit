import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_CONCAT } from '../../../_ids'

export interface I<T> {
  a: T[]
  b: T[]
}

export interface O<T> {
  ab: T[]
}

export default class Concat<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      {},
      system,
      ID_CONCAT
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ ab: a.concat(b) })
  }
}
