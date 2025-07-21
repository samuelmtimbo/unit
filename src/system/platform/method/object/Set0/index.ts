import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_SET_2 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
  data: $
  done: any
}

export interface O<T> {
  done: any
}

export default class Set0<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['obj', 'name', 'data'],
        fo: ['done'],
        i: [],
        o: [],
      },
      {
        input: {
          obj: {
            ref: true,
          },
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_2
    )
  }

  async f({ obj, name, data }: I<T>, done: Done<O<T>>, fail: Fail) {
    try {
      const raw = await data.raw()

      await obj.set(name, raw)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ done: 1 })
  }
}
