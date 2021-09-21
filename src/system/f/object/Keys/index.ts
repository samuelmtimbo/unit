import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'
import keys from './f'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['obj'],
        o: ['keys'],
      },
      config
    )
  }

  f(i: I<T>, done): void {
    done(keys(i))
  }
}
