import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_STROKE_STYLE } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  strokeStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class StrokeStyle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['strokeStyle', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_STROKE_STYLE
    )
  }

  f({ d, strokeStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['strokeStyle', strokeStyle]],
    })
  }
}
