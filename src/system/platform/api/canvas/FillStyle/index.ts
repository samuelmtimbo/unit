import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_FILL_STYLE } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  fillStyle: string
}

export interface O<T> {
  d: any[][]
}

export default class FillStyle<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['fillStyle', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_FILL_STYLE
    )
  }

  f({ d, fillStyle }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['fillStyle', fillStyle]],
    })
  }
}
