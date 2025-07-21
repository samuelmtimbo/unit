import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_SHIFT } from '../../../../_ids'

export interface I<T> {
  a: A<T>
  any: any
}

export interface O<T> {
  first: T
}

export default class Shift<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'any'],
        o: ['first'],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
      },
      system,
      ID_SHIFT
    )
  }

  async f({ a }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    let first: T

    try {
      first = await a.shift()
    } catch (err) {
      fail(err.message)

      return
    }

    done({ first })
  }
}
