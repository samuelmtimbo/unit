import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sign(a)': number
}

export default class Sign<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['sign(a)'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sign(a)': Math.sign(a) })
  }
}
