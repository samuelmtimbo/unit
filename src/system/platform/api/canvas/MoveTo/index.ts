import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_MOVE_TO } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  x: number
  y: number
}

export interface O<T> {
  d: any[][]
}

export default class MoveTo<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['x', 'y', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_MOVE_TO
    )
  }

  f({ d, x, y }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['moveTo', x, y]],
    })
  }
}
