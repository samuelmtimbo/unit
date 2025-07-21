import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_INIT } from '../../../_ids'

export interface I<T> {
  n: number
  a: T
}

export interface O<T> {
  'a[]': T[]
}

export default class Init<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['n', 'a'],
        o: ['a[]'],
      },
      {},
      system,
      ID_INIT
    )
  }

  f({ a, n }: I<T>, done: Done<O<T>>, fail: Fail): void {
    done({ 'a[]': new Array(n).fill(a) })
  }
}
