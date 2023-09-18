import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_HAS_KEY_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  key: string
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['has'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_HAS_KEY_0
    )
  }

  async f({ obj, key }: I<T>, done: Done<O<T>>) {
    let has: boolean

    try {
      has = await obj.hasKey(key)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ has })
  }
}
