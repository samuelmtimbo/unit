import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_WAIT } from '../../../_ids'

export interface I<T> {
  a: T
  signal: any
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

  f({ a }: I<T>, done): void {
    done({ a })
  }
}
