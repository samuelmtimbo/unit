import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_FROM_ENTRIES } from '../../../_ids'
import fromEntries_ from './f'

export interface I<T> {
  entries: [string, any][]
}

export interface O<T> {
  obj: object
}

export default class FromEntries<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['entries'],
        o: ['obj'],
      },
      {},
      system,
      ID_FROM_ENTRIES
    )
  }

  f(i: I<T>, done: Done<O<T>>): void {
    done(fromEntries_(i))
  }
}
