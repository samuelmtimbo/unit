import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_ADD_ARC } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  path: string
}

export interface O<T> {
  d: any[][]
}

export default class AddPath<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['path', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_ADD_ARC
    )
  }

  f({ d, path }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['path', path]],
    })
  }
}
