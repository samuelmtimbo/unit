import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_APPEND } from '../../../_ids'

export interface I<T> {
  a: T[]
  b: T
}

export interface O<T> {
  a: T[]
}

export default class Append<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      {},
      system,
      ID_APPEND
    )
  }

  f({ a, b }: I<T>, done: Done<O<T>>, fail: Fail): void {
    done({ a: [...a, b] })
  }
}
