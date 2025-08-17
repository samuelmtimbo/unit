import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_REMOVE } from '../../../_ids'
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
  constructor(system: System) {
    super(
      {
        i: ['a', 'start', 'count'],
        o: ['a', 'removed'],
      },
      {},
      system,
      ID_REMOVE
    )
  }

  f(i: I<T>, done: Done<O<T>>): void {
    done(remove(i))
  }
}
