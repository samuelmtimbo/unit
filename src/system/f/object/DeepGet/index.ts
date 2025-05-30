import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { deepGet } from '../../../../util/object'
import { ID_DEEP_GET } from '../../../_ids'

export interface I<T> {
  obj: object
  path: string[]
}

export interface O<T> {
  value: T
}

export default class DeepGet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
        o: ['value'],
      },
      {},
      system,
      ID_DEEP_GET
    )
  }

  f({ obj, path }: I<T>, done: Done<O<T>>): void {
    let value: any

    try {
      value = deepGet(obj, path)

      if (value === undefined) {
        throw new Error('key not found')
      }
    } catch (err) {
      done(undefined, 'key not found')

      return
    }

    done({
      value,
    })
  }
}
