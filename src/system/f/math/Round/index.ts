import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_ROUND } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  b: number
}

export default class Round<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['b'],
      },
      {},
      system,
      ID_ROUND
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    done({ b: Math.round(a) })
  }
}
