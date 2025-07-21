import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DEEP_SET_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  path: string[]
  value: string
}

export interface O<T> {}

export default class DeepSet<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path', 'value'],
        o: [],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_DEEP_SET_0
    )
  }

  async f({ obj, path, value }: I<T>, done: Done<O<T>>, fail: Fail) {
    try {
      await obj.deepSet(path, value)
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
