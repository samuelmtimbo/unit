import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DELETE_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
}

export interface O<T> {}

export default class Delete<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'name'],
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
      ID_DELETE_0
    )
  }

  async f({ obj, name }: I<T>, done: Done<O<T>>, fail: Fail) {
    try {
      await obj.delete(name)

      done()
    } catch (err) {
      fail(err.message)
    }
  }
}
