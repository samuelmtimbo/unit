import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { ID_EQUALS } from '../../../_ids'
import isEqual from './f'

export interface I<T> {
  a: T
  b: T
}

export interface O {
  'a = b': boolean
}

export default class Equals<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['a', 'b'],
        o: ['a = b'],
      },
      {},
      system,
      ID_EQUALS
    )
  }

  f({ a, b }: I<T>, done): void {
    done({
      'a = b': isEqual(a, b),
    })
  }
}
