import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { System } from '../../../../system'
import { clone } from '../../../../util/clone'
import { deepSet } from '../../../../util/object'
import { ID_DEEP_SET } from '../../../_ids'

export interface I<T> {
  obj: object
  path: string[]
  value: any
}

export interface O<T> {
  obj: object
}

export default class DeepSet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path', 'value'],
        o: ['obj'],
      },
      {},
      system,
      ID_DEEP_SET
    )
  }

  f({ obj, path, value }: I<T>, done: Done<O<T>>, fail: Fail): void {
    let obj_ = clone(obj)

    try {
      deepSet(obj_, path, value)
    } catch (err) {
      fail(err.message)

      return
    }

    done({
      obj: obj_,
    })
  }
}
