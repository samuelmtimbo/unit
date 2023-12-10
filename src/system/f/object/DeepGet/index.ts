import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import deepGet from '../../../../deepGet'
import { System } from '../../../../system'
import { ID_DEEP_GET } from '../../../_ids'

export interface I<T> {
  obj: object
  path: string[]
}

export interface O<T> {
  result: T
}

export default class DeepGet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
        o: ['result'],
      },
      {},
      system,
      ID_DEEP_GET
    )
  }

  f({ obj, path }: I<T>, done: Done<O<T>>): void {
    let result: any

    try {
      result = deepGet(obj, path)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({
      result,
    })
  }
}
