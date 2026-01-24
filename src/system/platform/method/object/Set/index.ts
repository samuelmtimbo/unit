import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { $J } from '../../../../../types/interface/async/$J'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_SET_1 } from '../../../../_ids'

export interface I<T> {
  obj: $J
  name: string
  data: T
}

export interface O<T> {
  data: any
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'name', 'data'],
        o: ['data'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_1
    )
  }

  async f({ obj, name, data }: I<T>, done: Done<O<T>>, fail: Fail) {
    obj = Async(obj, ['J'], this.__system.async)

    const _data = stringify(data)

    obj.$set({ name, data: _data }, (_, err) => {
      fail(err)

      return
    })

    done({ data })
  }
}
