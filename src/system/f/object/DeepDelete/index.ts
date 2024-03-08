import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { clone, deepDelete } from '../../../../util/object'
import { ID_DEEP_DELETE } from '../../../_ids'

export interface I<T> {
  obj: object
  path: string[]
}

export interface O<T> {
  obj: object
}

export default class DeepDelete<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
        o: ['obj'],
      },
      {
        input: {},
      },
      system,
      ID_DEEP_DELETE
    )
  }

  async f({ obj, path }: I<T>, done: Done<O<T>>): Promise<void> {
    let obj_: object = clone(obj)

    deepDelete(obj_, path)

    done({
      obj: obj_,
    })
  }
}
