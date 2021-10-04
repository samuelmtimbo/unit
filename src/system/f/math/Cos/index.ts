import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  'cos(a)': number
}

export default class Cos<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['cos(a)'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'cos(a)': Math.cos(a) })
  }
}
