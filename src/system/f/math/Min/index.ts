import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_MIN } from '../../../_ids'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  min: number
}

export default class Min<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['min'],
      },
      {},
      system,
      ID_MIN
    )
  }

  f({ a, b }: I<T>, done: Done<O<T>>): void {
    done({ min: Math.min(a, b) })
  }
}
