import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Rect } from '../../../../../client/util/geometry/types'
import { System } from '../../../../../system'
import { ID_ADD_RECT } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  rect: Rect
}

export interface O<T> {
  d: any[][]
}

export default class AddRect<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['rect', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_ADD_RECT
    )
  }

  f({ d, rect: { x, y, width, height } }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rect', x, y, width, height]],
    })
  }
}
