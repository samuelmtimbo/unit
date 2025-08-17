import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_WAIT } from '../../../_ids'

export interface I<T> {
  a: T
  b: any
}

export interface O<T> {
  a: T
}

export default class Wait<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      {},
      system,
      ID_WAIT
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    done({ a })
  }
}
