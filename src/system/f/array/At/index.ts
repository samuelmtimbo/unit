import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_AT } from '../../../_ids'

export interface I<T> {
  a: T[]
  i: number
}

export interface O<T> {
  'a[i]': T
}

export default class At<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'i'],
        o: ['a[i]'],
      },
      {},
      system,
      ID_AT
    )
  }

  f({ a, i }: I<T>, done: Done<O<T>>, fail: Fail): void {
    if (i >= 0 && i < a.length) {
      done({ 'a[i]': a[i] })
    } else {
      fail('index out of boundary')
    }
  }
}
