import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_LENGTH } from '../../../_ids'
import _length from './f'

export interface I<T> {
  a: T[]
}

export interface O {
  length: number
}

export default class Length<T> extends Functional<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      {},
      system,
      ID_LENGTH
    )
  }

  f(i: I<T>, done: Done<O>): void {
    done(_length(i))
  }
}
