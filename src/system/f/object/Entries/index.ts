import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_ENTRIES } from '../../../_ids'
import entries_ from './f'

export interface I<T> {
  obj: Dict<any>
}

export interface O<T> {
  entries: [string, any][]
}

export default class Entries<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj'],
        o: ['entries'],
      },
      {},
      system,
      ID_ENTRIES
    )
  }

  f(i: I<T>, done: Done<O<T>>): void {
    done(entries_(i))
  }
}
