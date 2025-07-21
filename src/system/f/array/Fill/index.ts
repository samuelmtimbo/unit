import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_FILL } from '../../../_ids'

export interface I<T> {
  a: T[]
  value: T
  start: number
  end: number
}

export interface O<T> {
  a: T[]
}

export default class Fill<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'value', 'start', 'end'],
        o: ['a'],
      },
      {},
      system,
      ID_FILL
    )
  }

  f({ a, value, start, end }: I<T>, done: Done<O<T>>, fail: Fail): void {
    done({ a: a.fill(value, start, end) })
  }
}
