import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DEEP_GET_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  path: string[]
}

export interface O<T> {
  value: any
}

export default class DeepGet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
        o: ['value'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
        output: {
          value: {
            ref: true,
          },
        },
      },
      system,
      ID_DEEP_GET_0
    )
  }

  async f({ obj, path }: I<T>, done: Done<O<T>>, fail: Fail) {
    let value: any

    try {
      value = await obj.deepGet(path)
    } catch (err) {
      fail(err.message)

      return
    }

    done({
      value,
    })
  }
}
