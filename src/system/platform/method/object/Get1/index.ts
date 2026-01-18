import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { ALL_INTERFACES } from '../../../../../client/method'
import { System } from '../../../../../system'
import { $J } from '../../../../../types/interface/async/$J'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_GET_1 } from '../../../../_ids'

export interface I<T> {
  obj: $J & $
  name: string
  done: any
}

export interface O<T> {
  value: T
  done: any
}

export default class Get1<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['obj', 'name'],
        fo: ['value'],
        i: [],
        o: ['done'],
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
      ID_GET_1,
      'done'
    )
  }

  async f({ obj, name }: I<T>, done: Done<O<T>>, fail: Fail) {
    obj = Async(obj, obj.__, this.__system.async)

    try {
      const value = await obj.$ref({ name, __: ALL_INTERFACES })

      if (value === null) {
        fail('key not found')

        return
      }

      done({ value })
    } catch (err) {
      fail(err.message)

      return
    }
  }

  b() {
    this._output.done.push(true)
  }
}
