import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_GET } from '../../../_ids'

export interface I<T> {
  obj: object
  key: string | number
}

export interface O<T> {
  value: T
}

export default class Get<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'key'],
        o: ['value'],
      },
      {},
      system,
      ID_GET
    )
  }

  f({ obj, key }: I<T>, done: Done<O<T>>): void {
    if (obj.hasOwnProperty(key)) {
      done({ value: obj[key] })
    } else {
      done(undefined, 'key not found')
    }
  }
}
