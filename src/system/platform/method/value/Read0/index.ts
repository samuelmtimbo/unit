import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { ALL_INTERFACES } from '../../../../../client/method'
import { System } from '../../../../../system'
import { $V } from '../../../../../types/interface/async/$V'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_READ_0 } from '../../../../_ids'

export interface I<T> {
  value: $V
  any: any
}

export interface O<T> {
  data: T & $
}

export default class Read0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'any'],
        o: ['data'],
      },
      {
        input: {
          value: {
            ref: true,
          },
        },
        output: {
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_READ_0
    )
  }

  f({ value, any }: I<T>, done: Done<O<T>>, fail: Fail) {
    value = Async(value, ['V'], this.__system.async)

    const data = value.$refer({ __: ALL_INTERFACES })

    done({ data })
  }
}
