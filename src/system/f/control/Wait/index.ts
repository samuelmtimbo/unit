import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T
  signal: any
}

export interface O<T> {
  a: T
}

export default class Wait<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ a })
  }
}
