import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DEEP_DELETE } from '../../../../_ids'

export interface I<T> {
  obj: J<T>
  path: string[]
}

export interface O<T> {}

export default class DeepDelete<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
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
      ID_DEEP_DELETE
    )
  }

  async f({ obj, path }: I<T>, done: Done<O<T>>, fail: Fail): Promise<void> {
    try {
      await obj.deepDelete(path)
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
