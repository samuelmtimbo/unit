import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_NOT_EQUAL } from '../../../_ids'
import isEqual from '../Equals/f'

export interface I<T> {
  a: T
  b: T
}

export interface O {
  'a ≠ b': boolean
}

export default class NotEqual<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a ≠ b'],
      },
      {},
      system,
      ID_NOT_EQUAL
    )
  }

  f({ a, b }: I<T>, done: Done<O>): void {
    done({
      'a ≠ b': !isEqual(a, b),
    })
  }
}
