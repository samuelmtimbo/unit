import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_SCALE_0 } from '../../../../_ids'

export interface I<T> {
  sx: number
  sy: number
  d: any[][]
}

export interface O<T> {
  d: any[][]
}

export default class Scale0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['sx', 'sy', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_SCALE_0
    )
  }

  f({ d, sx, sy }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['scale', sx, sy]],
    })
  }
}
