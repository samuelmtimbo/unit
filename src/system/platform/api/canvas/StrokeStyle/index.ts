import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_STROKE } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  strokeStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class Stroke<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['strokeStyle', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_STROKE
    )
  }

  f({ d, strokeStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['strokeStyle', strokeStyle]],
    })
  }
}
