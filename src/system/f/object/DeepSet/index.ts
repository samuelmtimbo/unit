import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
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
  result: object
}

export default class DeepSet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path', 'value'],
        o: ['result'],
      },
      {},
      system,
      ID_DEEP_SET
    )
  }

  f({ obj, path, value }: I<T>, done: Done<O<T>>): void {
    let result = clone(obj)

    try {
      deepSet(result, path, value)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({
      result,
    })
  }
}
