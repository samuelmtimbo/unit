import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  obj: object
  key: string | number
}

export interface O<T> {
  value: T
}

export default class Prop<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['obj', 'key'],
        o: ['value'],
      },
      config
    )
  }

  f({ obj, key }: I<T>, done: Done<O<T>>): void {
    if (obj.hasOwnProperty(key)) {
      done({ value: obj[key] })
    } else {
      done(undefined, 'key not found in object')
    }
  }
}
