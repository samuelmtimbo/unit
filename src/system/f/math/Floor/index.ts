import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_FLOOR } from '../../../_ids'

export interface I<T> {
  a: number
}

export interface O<T> {
  '⌊a⌋': number
}

export default class Floor<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['⌊a⌋'],
      },
      {},
      system,
      ID_FLOOR
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    done({ '⌊a⌋': Math.floor(a) })
  }
}
