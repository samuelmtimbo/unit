import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
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

  async f({ obj, path }: I<T>, done: Done<O<T>>): Promise<void> {
    try {
      await obj.deepDelete(path)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
