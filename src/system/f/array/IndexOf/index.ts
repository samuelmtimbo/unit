import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { ID_INDEX_OF } from '../../../_ids'

export interface I<T> {
  'a[]': T[]
  a: T
}

export interface O<T> {
  i: number
}

export default class IndexOf<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a[]', 'a'],
        o: ['i'],
      },
      {},
      system,
      ID_INDEX_OF
    )
  }

  f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>, fail: Fail): void {
    done({
      i: _a.indexOf(a),
    })
  }
}
