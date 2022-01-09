import { Functional } from '../../../../Class/Functional'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import remove from './f'

export interface I<T> {
  a: T[]
  start: number
  count: number
}

export interface O<T> {
  a: T[]
  removed: T[]
}

export default class Remove<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['a', 'start', 'count'],
        o: ['a', 'removed'],
      },
      {},
      system,
      pod
    )
  }

  f(i: I<T>, done): void {
    done(remove(i))
  }
}
