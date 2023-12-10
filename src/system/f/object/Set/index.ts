import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_SET } from '../../../_ids'
import _set from './f'

export interface I<T> {
  obj: Dict<T>
  key: string | number
  value: T
}

export interface O<T> {
  obj: object
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key', 'value'],
        o: ['obj'],
      },
      {},
      system,
      ID_SET
    )
  }

  f({ obj, key, value }: I<T>, done: Done<O<T>>): void {
    // console.log('Set_normal', 'f', obj, key, value)

    if (this.isPinRef('input', 'obj')) {
      obj[key] = value
    }

    if (this.isPinRef('output', 'obj')) {
      done({ obj })
    } else {
      done({ obj: _set(obj, key, value) })
    }
  }
}
