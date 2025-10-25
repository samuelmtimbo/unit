import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_SHIFT } from '../../../../_ids'

export interface I<T> {
  a: A<T>
  any: any
}

export interface O<T> {
  first: T
  done: any
}

export default class Shift<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a', 'any'],
        fo: ['first'],
        i: [],
        o: ['done'],
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

  b() {
    this._output.done.push(true)
  }
}
