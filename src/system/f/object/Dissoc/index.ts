import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_DISSOC } from '../../../_ids'
import _dissoc from './f'

export interface I<T> {
  obj: Dict<T>
  key: number | string
  value: T
}

export interface O<T> {
  obj: Dict<T>
}

export default class Dissoc<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['obj'],
      },
      {},
      system,
      ID_DISSOC
    )
  }

  f({ obj, key }: I<T>, done): void {
    done({ obj: _dissoc(obj, key) })
  }
}
