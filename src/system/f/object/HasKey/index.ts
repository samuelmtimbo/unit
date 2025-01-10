import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_HAS_KEY } from '../../../_ids'

export interface I<T> {
  obj: Dict<T>
  key: string | number
}

export interface O<T> {
  has: boolean
}

export default class HasKey<T = any> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['has'],
      },
      {},
      system,
      ID_HAS_KEY
    )
  }

  f({ obj, key }: I<T>, done: Done<O<T>>): void {
    done({ has: obj.hasOwnProperty(key) && obj[key] !== undefined })
  }
}
