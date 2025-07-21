import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { ID_LENGTH_1 } from '../../../../_ids'

export interface I<T> {
  a: A
  any: any
}

export interface O<T> {
  length: number
}

export default class Length1<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'any'],
        o: ['length'],
      },
      {
        input: {
          a: {
            ref: true,
          },
        },
      },
      system,
      ID_LENGTH_1
    )
  }

  async f({ a }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    let length: number

    try {
      length = await a.length()
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({ length })
  }
}
