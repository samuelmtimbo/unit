import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Identity<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['a'],
      },
      config
    )
  }

  f({ a }: Partial<I<T>>, done): void {
    done({ a })
  }
}
