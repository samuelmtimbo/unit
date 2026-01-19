import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { $A } from '../../../../../types/interface/async/$A'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_APPEND_0 } from '../../../../_ids'

export interface I<T> {
  'a[]': $A
  a: T
}

export interface O<T> {}

export default class Append<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a[]', 'a'],
        o: [],
      },
      {
        input: {
          'a[]': {
            ref: true,
          },
        },
      },
      system,
      ID_APPEND_0
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    _a = Async(_a, ['A'], this.__system.async)

    _a.$append({ a }, (_, err) => {
      if (err) {
        fail(err)

        return
      }

      done({})
    })
  }
}
