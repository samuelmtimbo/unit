import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_AT_1 } from '../../../../_ids'

export interface I<T> {
  a: A
  i: number
  done: any
}

export interface O<T> {
  'a[i]': T
}

export default class At1<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['a', 'i'],
        fo: ['a[i]'],
        i: [],
        o: [],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
        output: {
          'a[i]': {
            ref: true,
          },
        },
      },
      system,
      ID_AT_1
    )
  }

  async f({ a, i }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    let _a_i: T

    try {
      const l = await a.length()

      if (i >= 0 && i < l) {
        _a_i = await a.at(i)
      } else {
        fail('index out of boundary')

        return
      }
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({ 'a[i]': _a_i })
  }
}
