import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_KEYS } from '../../../../_ids'

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
      ID_KEYS
    )
  }

  async f({ obj, any }: I<T>, done: Done<O<T>>) {
    let keys: string[]

    try {
      keys = await obj.keys()
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ keys })
  }
}
