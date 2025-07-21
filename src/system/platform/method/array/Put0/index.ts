import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_PUT_0 } from '../../../../_ids'

export interface I<T> {
  a: A
  i: number
  v: any
}

export interface O<T> {}

export default class Put0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'i', 'v'],
        o: [],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
      },
      system,
      ID_PUT_0
    )
  }

  async f({ a, i, v }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    try {
      await a.put(i, v)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done()
  }
}
