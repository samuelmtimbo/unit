import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { ID_ADD_ARC } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  arc: {
    x: number
    y: number
    r: number
    start: number
    end: number
    anticlockwise?: boolean
  }
}

export interface O<T> {
  d: any[][]
}

export default class VideoEncoder<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['arc', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_ADD_ARC
    )
  }

  f(
    { d, arc: { x, y, r, start, end, anticlockwise = false } }: I<T>,
    done: Done<O<T>>
  ): void {
    done({
      d: [...d, ['arc', x, y, r, start, end, anticlockwise]],
    })
  }
}
