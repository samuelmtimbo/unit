import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: T[]
  b: T[]
}

export interface O<T> {
  ab: T[]
}

export default class Concat<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      config
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ ab: a.concat(b) })
  }
}
