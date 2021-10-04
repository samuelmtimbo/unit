import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'
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
  constructor(config?: Config) {
    super(
      {
        i: ['obj', 'key'],
        o: ['obj'],
      },
      config
    )
  }

  f({ obj, key }: I<T>, done): void {
    done({ obj: _dissoc(obj, key) })
  }
}
