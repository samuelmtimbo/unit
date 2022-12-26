import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_TRANSLATE } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  x: number
  y: number
}

export interface O<T> {
  d: any[][]
}

export default class Translate<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['d', 'x', 'y'],
        o: ['d'],
      },
      {},
      system,
      ID_TRANSLATE
    )
  }

  f({ d, x, y }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['translate', x, y]],
    })
  }
}
