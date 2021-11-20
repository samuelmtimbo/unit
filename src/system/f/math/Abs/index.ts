import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  '|a|': number
}

export default class Abs<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['|a|'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ '|a|': Math.abs(a) })
  }
}
