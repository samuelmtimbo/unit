import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_ROTATE } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  rad: number
}

export interface O<T> {
  d: any[][]
}

export default class Rotate<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['d', 'rad'],
        o: ['d'],
      },
      {},
      system,
      ID_ROTATE
    )
  }

  f({ d, rad }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['rotate', rad]],
    })
  }
}
