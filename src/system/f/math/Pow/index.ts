import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
  b: number
}

export interface O<T> {
  'a ** b': number
}

export default class Pow<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a ** b'],
      },
      config
    )
  }

  f({ a, b }: I<T>, done): void {
    done({ 'a ** b': Math.pow(a, b) })
  }
}
