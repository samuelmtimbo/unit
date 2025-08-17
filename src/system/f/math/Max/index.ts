import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_MAX } from '../../../_ids'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  max: number
}

export default class Max<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['max'],
      },
      {},
      system,
      ID_MAX
    )
  }

  f({ a, b }: I<T>, done: Done<O<T>>): void {
    done({ max: Math.max(a, b) })
  }
}
