import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_PREPEND } from '../../../_ids'

export interface I<T> {
  a: T[]
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Prepend<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      {},
      system,
      ID_PREPEND
    )
  }

  f({ a, b }: I<T>, done: Done<O<T>>): void {
    done({ a: [b, ...a] })
  }
}
