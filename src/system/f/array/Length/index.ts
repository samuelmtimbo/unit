import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import length from './f'

export interface I<T> {
  a: T[]
}

export interface O {
  length: number
}

export default class Length<T> extends Functional<I<T>, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a'],
        o: ['length'],
      },
      {},
      system,
      pod
    )
  }

  f(i: I<T>, done: Done<O>): void {
    done(length(i))
  }
}
