import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'
import assoc from './f'

export interface I<T> {
  obj: Dict<T>
  key: string | number
  value: T
}

export interface O<T> {
  obj: object
}

export default class Assoc<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['obj', 'key', 'value'],
        o: ['obj'],
      },
      config
    )
  }

  f({ obj, key, value }: I<T>, done): void {
    done({ obj: assoc(obj, key, value) })
  }
}
