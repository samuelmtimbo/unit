import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
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

  f({ obj, key }: I<T>, done: Done<O<T>>, fail: Fail): void {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      done({ value: obj[key] })
    } else {
      fail('key not found')
    }
  }
}
