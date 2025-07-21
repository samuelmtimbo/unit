import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_POP_0 } from '../../../../_ids'

export interface I<T> {
  a: A<T>
  any: any
}

export interface O<T> {
  last: T
  done: any
}

export default class Pop<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a', 'any'],
        fo: ['last'],
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
      ID_POP_0
    )
  }

  async f({ a }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    let last: T

    try {
      last = await a.pop()
    } catch (err) {
      fail(err.message)

      return
    }

    done({ last })
  }

  b() {
    this._output.done.push(true)
  }
}
