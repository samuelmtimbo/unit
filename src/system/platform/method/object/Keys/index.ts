import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_KEYS_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  any: any
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'any'],
        o: ['keys'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_KEYS_0
    )
  }

  async f({ obj, any }: I<T>, done: Done<O<T>>, fail: Fail) {
    let keys: string[]

    try {
      keys = await obj.keys()
    } catch (err) {
      fail(err.message)

      return
    }

    done({ keys })
  }
}
