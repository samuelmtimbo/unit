import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  max: number
}

export default class Max<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['max'],
      },
      config
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ max: Math.max(a, b) })
  }
}
