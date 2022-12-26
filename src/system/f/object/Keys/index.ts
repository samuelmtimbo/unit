import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_KEYS } from '../../../_ids'
import _keys from './f'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj'],
        o: ['keys'],
      },
      {},
      system,
      ID_KEYS
    )
  }

  f(i: I<T>, done): void {
    done(_keys(i))
  }
}
